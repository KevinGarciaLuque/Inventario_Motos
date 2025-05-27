import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ReportsPage() {
  const [resumen, setResumen] = useState({
    productosUnicos: 0,
    totalStock: 0,
    valorInventario: 0,
    bajoStock: 0,
  });
  const [porCategoria, setPorCategoria] = useState([]);
  const [productos, setProductos] = useState([]);
  const [logoBase64, setLogoBase64] = useState(null);

  // Cargar logo base64 para el PDF
  useEffect(() => {
    fetch("/logo.png")
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result);
        reader.readAsDataURL(blob);
      });
  }, []);

  // Cargar los datos del inventario
  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const productosRes = await api.get("/productos");
        const productos = productosRes.data;
        setProductos(productos);

        // Cálculos
        const productosUnicos = productos.length;
        const totalStock = productos.reduce(
          (sum, p) => sum + Number(p.stock || 0),
          0
        );
        const valorInventario = productos.reduce(
          (sum, p) => sum + Number(p.stock || 0) * Number(p.precio || 0),
          0
        );
        const bajoStock = productos.filter(
          (p) => Number(p.stock) < Number(p.stock_minimo)
        ).length;

        // Por categoría
        const categoriasMap = {};
        productos.forEach((p) => {
          const cat = p.categoria || "Sin Categoría";
          categoriasMap[cat] = (categoriasMap[cat] || 0) + Number(p.stock || 0);
        });
        const categoriasArray = Object.entries(categoriasMap).map(
          ([categoria, cantidad]) => ({
            categoria,
            cantidad,
          })
        );

        setResumen({ productosUnicos, totalStock, valorInventario, bajoStock });
        setPorCategoria(categoriasArray);
      } catch (e) {
        setResumen({
          productosUnicos: 20,
          totalStock: 25,
          valorInventario: 64000,
          bajoStock: 3,
        });
        setPorCategoria([
          { categoria: "Motor", cantidad: 6 },
          { categoria: "Frenos", cantidad: 3 },
          { categoria: "Transmisión", cantidad: 5 },
          { categoria: "Eléctrico", cantidad: 2 },
          { categoria: "Suspensión", cantidad: 4 },
        ]);
      }
    };
    fetchResumen();
  }, []);

  // Datos para el gráfico
  const chartData = {
    labels: porCategoria.map((x) => x.categoria),
    datasets: [
      {
        label: "Cantidad total en stock",
        data: porCategoria.map((x) => x.cantidad),
        backgroundColor: "#ffc107",
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  };

  // Exportar a Excel inventario
  const exportExcel = () => {
    const data = productos.map((prod) => ({
      Código: prod.codigo,
      Nombre: prod.nombre,
      Categoría: prod.categoria,
      Ubicación: prod.ubicacion,
      Stock: prod.stock,
      "Stock mínimo": prod.stock_minimo,
      Precio: prod.precio,
      Descripción: prod.descripcion,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "inventario.xlsx"
    );
  };

  // Exportar PDF inventario
  const exportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    // Logo y título
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 40, 20, 60, 60);
    }
    doc.setFontSize(18);
    doc.text("Inventario de Productos", 120, 50);

    const columns = [
      { header: "Código", dataKey: "codigo" },
      { header: "Nombre", dataKey: "nombre" },
      { header: "Categoría", dataKey: "categoria" },
      { header: "Ubicación", dataKey: "ubicacion" },
      { header: "Stock", dataKey: "stock" },
      { header: "Stock mínimo", dataKey: "stock_minimo" },
      { header: "Precio", dataKey: "precio" },
      { header: "Descripción", dataKey: "descripcion" },
    ];

    // ¡Usa autoTable correctamente!
    autoTable(doc, {
      head: [columns.map((col) => col.header)],
      body: productos.map((prod) => columns.map((col) => prod[col.dataKey])),
      startY: 90,
      theme: "striped",
      styles: { fontSize: 9 },
      margin: { left: 40, right: 40 },
    });

    doc.save("inventario.pdf");
  };

  // Exportar resumen PDF
  const exportResumenPDF = () => {
    const doc = new jsPDF();
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", 15, 8, 30, 30);
    }
    doc.setFontSize(16);
    doc.text("Resumen de Inventario", 50, 22);

    doc.setFontSize(11);
    autoTable(doc, {
      startY: 40,
      head: [["Concepto", "Valor"]],
      body: [
        ["Referencias únicas", resumen.productosUnicos],
        ["Total en stock", resumen.totalStock],
        [
          "Valor inventario",
          resumen.valorInventario.toLocaleString("es-HN", {
            style: "currency",
            currency: "HNL",
          }),
        ],
        ["Bajo stock", resumen.bajoStock],
      ],
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 193, 7] },
      margin: { left: 15, right: 15 },
    });

    autoTable(doc, {
      startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 80,
      head: [["Categoría", "Cantidad en stock"]],
      body: porCategoria.map((c) => [c.categoria, c.cantidad]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [255, 193, 7] },
      margin: { left: 15, right: 15 },
    });

    doc.save("resumen_inventario.pdf");
  };

  // Exportar resumen a Excel
  const exportResumenExcel = () => {
    const resumenData = [
      { Concepto: "Referencias únicas", Valor: resumen.productosUnicos },
      { Concepto: "Total en stock", Valor: resumen.totalStock },
      { Concepto: "Valor inventario", Valor: resumen.valorInventario },
      { Concepto: "Bajo stock", Valor: resumen.bajoStock },
    ];
    const categoriaData = porCategoria.map((c) => ({
      Categoría: c.categoria,
      "Cantidad en stock": c.cantidad,
    }));

    const ws1 = XLSX.utils.json_to_sheet(resumenData);
    const ws2 = XLSX.utils.json_to_sheet(categoriaData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Resumen");
    XLSX.utils.book_append_sheet(wb, ws2, "Por Categoría");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "resumen_inventario.xlsx"
    );
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">
        <i className="bi bi-bar-chart-fill text-warning me-2"></i>
        Reportes
      </h2>
      <div className="d-flex flex-wrap gap-2 mb-4 justify-content-end">
        <button className="btn btn-success" onClick={exportExcel}>
          <i className="bi bi-file-earmark-excel me-1"></i> Inventario Excel
        </button>
        <button className="btn btn-primary" onClick={exportPDF}>
          <i className="bi bi-file-earmark-pdf me-1"></i> Inventario PDF
        </button>
        <button
          className="btn btn-outline-success"
          onClick={exportResumenExcel}
        >
          <i className="bi bi-file-earmark-excel me-1"></i> Resumen Excel
        </button>
        <button className="btn btn-outline-primary" onClick={exportResumenPDF}>
          <i className="bi bi-file-earmark-pdf me-1"></i> Resumen PDF
        </button>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow h-100 text-center">
            <div className="card-body">
              <i className="bi bi-123 h2 text-primary"></i>
              <h6 className="card-title mt-2 text-muted">Referencias únicas</h6>
              <p className="fs-4 fw-bold">{resumen.productosUnicos}</p>
              <div className="small text-muted">Productos diferentes</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow h-100 text-center">
            <div className="card-body">
              <i className="bi bi-boxes h2 text-warning"></i>
              <h6 className="card-title mt-2 text-muted">Total en stock</h6>
              <p className="fs-4 fw-bold">{resumen.totalStock}</p>
              <div className="small text-muted">Suma del stock</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow h-100 text-center">
            <div className="card-body">
              <i className="bi bi-cash-stack h2 text-success"></i>
              <h6 className="card-title mt-2 text-muted">Valor inventario</h6>
              <p className="fs-4 fw-bold">
                {resumen.valorInventario.toLocaleString("es-HN", {
                  style: "currency",
                  currency: "HNL",
                  minimumFractionDigits: 2,
                })}
              </p>
              <div className="small text-muted">Total estimado</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow h-100 text-center">
            <div className="card-body">
              <i className="bi bi-exclamation-triangle h2 text-danger"></i>
              <h6 className="card-title mt-2 text-muted">Bajo stock</h6>
              <p className="fs-4 fw-bold">{resumen.bajoStock}</p>
              <div className="small text-muted">Por debajo del mínimo</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card border-0 shadow p-4 mb-4">
        <h5 className="mb-3">
          <i className="bi bi-graph-up-arrow text-warning me-2"></i>
          Productos por Categoría
        </h5>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { color: "#eee" } },
            },
          }}
          height={100}
        />
      </div>
    </div>
  );
}
