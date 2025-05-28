import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import EditProductModal from "../components/EditProductModal";

// Cambia si tu backend no está en localhost:5000
const API_URL = "http://localhost:5000";

export default function InventoryPage({ onView }) {
  const [items, setItems] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [stockFilter, setStockFilter] = useState(""); // Nuevo filtro
  const [loading, setLoading] = useState(false);

  // Para editar
  const [editModal, setEditModal] = useState({ show: false, product: null });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, ubiRes] = await Promise.all([
        api.get("/productos"),
        api.get("/categorias"),
        api.get("/ubicaciones"),
      ]);
      setItems(prodRes.data);
      setCategorias(catRes.data);
      setUbicaciones(ubiRes.data);
    } catch {
      window.alert("Error al cargar los datos de inventario");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await api.delete(`/productos/${id}`);
        setItems((prev) => prev.filter((prod) => prod.id !== id));
        alert("Producto eliminado correctamente");
      } catch {
        alert("No se pudo eliminar el producto");
      }
    }
  };

  // Filtrado
  const filtered = items.filter((item) =>
    item.nombre.toLowerCase().includes(search.toLowerCase()) &&
    (category ? Number(item.categoria_id) === Number(category) : true) &&
    (location ? Number(item.ubicacion_id) === Number(location) : true) &&
    (stockFilter === ""
      ? true
      : stockFilter === "bajo"
      ? item.stock <= (item.stock_minimo || 1)
      : item.stock > (item.stock_minimo || 1))
  );

  return (
    <section className="container py-4">
      <h2 className="mb-4 text-center">Inventario de Repuestos</h2>
      {/* FILTROS */}
      <div className="row g-2 g-sm-3 mb-3 inventory-filtros">
        <div className="col-12 col-sm-4 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-12 col-sm-4 col-md-3">
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-sm-4 col-md-3">
          <select
            className="form-select"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Todas las ubicaciones</option>
            {ubicaciones.map((ubi) => (
              <option key={ubi.id} value={ubi.id}>
                {ubi.nombre}
              </option>
            ))}
          </select>
        </div>
        {/* Filtro extra por stock */}
        <div className="col-12 col-md-3">
          <select
            className="form-select"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="">Todos los productos</option>
            <option value="bajo">Solo stock bajo</option>
            <option value="suficiente">Solo stock suficiente</option>
          </select>
        </div>
      </div>
      {/* TABLA */}
      <div className="bg-white shadow rounded table-responsive">
        <table className="table table-bordered align-middle inventory-table">
          <thead className="table-light">
            <tr>
              <th>Imagen</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Ubicación</th>
              <th>Stock</th>
              <th>Precio</th>
              <th style={{ width: 170 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center">
                  Cargando...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  No hay productos para mostrar
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.imagen ? (
                      <img
                        src={
                          item.imagen.startsWith("http")
                            ? item.imagen
                            : item.imagen.startsWith("/uploads")
                            ? API_URL + item.imagen
                            : API_URL + "/uploads/" + item.imagen
                        }
                        alt={item.nombre}
                        className="img-thumbnail"
                        style={{ maxHeight: 50, maxWidth: 70 }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <span className="text-muted">Sin imagen</span>
                    )}
                  </td>
                  <td>{item.codigo}</td>
                  <td>{item.nombre}</td>
                  <td>{item.categoria || "-"}</td>
                  <td>{item.ubicacion || "-"}</td>
                  <td>
                    <span className={item.stock <= (item.stock_minimo || 1)
                        ? "badge bg-danger bg-opacity-25 text-danger"
                        : "badge bg-success bg-opacity-25 text-success"}>
                      {item.stock}
                    </span>
                  </td>
                  <td>
                    {item.precio
                      ? Number(item.precio).toLocaleString("es-HN", {
                          style: "currency",
                          currency: "HNL",
                        })
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-warning btn-sm me-2"
                      onClick={() => onView(item)}
                      title="Ver"
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() =>
                        setEditModal({ show: true, product: item })
                      }
                      title="Editar"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                      title="Eliminar"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL de edición */}
      <EditProductModal
        show={editModal.show}
        product={editModal.product}
        categorias={categorias}
        ubicaciones={ubicaciones}
        onClose={() => setEditModal({ show: false, product: null })}
        onUpdated={cargarDatos}
      />

      {/* Estilos responsivos */}
      <style>{`
        /* Filtros apilados en móvil */
        @media (max-width: 767.98px) {
          .inventory-filtros {
            flex-direction: column !important;
            gap: 0.6rem !important;
          }
          .inventory-filtros > * {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        /* Tabla scroll y tamaño en móvil */
        @media (max-width: 575.98px) {
          .inventory-table th, .inventory-table td {
            font-size: 0.97rem !important;
            padding: 0.35rem 0.4rem !important;
            vertical-align: middle;
          }
          .inventory-table th {
            min-width: 75px;
          }
          .inventory-table td {
            word-break: break-word;
            white-space: pre-line;
          }
        }
      `}</style>
    </section>
  );
}
