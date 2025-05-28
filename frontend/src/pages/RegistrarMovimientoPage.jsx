import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useUser } from "../context/UserContext";
import { FaPlus, FaMinus } from "react-icons/fa";

export default function RegistrarMovimientoPage() {
  const { user } = useUser();
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    producto_id: "",
    tipo: "entrada",
    cantidad: 1,
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/productos").then((res) => setProductos(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "cantidad" ? Math.max(1, Number(value)) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.producto_id || !form.tipo || !form.cantidad || !user?.id) {
      alert("Todos los campos son obligatorios y debes estar logueado");
      return;
    }
    if (form.cantidad <= 0) {
      alert("La cantidad debe ser mayor que 0");
      return;
    }
    setLoading(true);
    try {
      await api.post("/movimientos", {
        ...form,
        cantidad: Number(form.cantidad),
        usuario_id: user.id,
      });
      alert("¡Movimiento registrado correctamente!");
      setForm({
        producto_id: "",
        tipo: "entrada",
        cantidad: 1,
        descripcion: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Error al registrar el movimiento. Verifica stock y datos."
      );
    }
    setLoading(false);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">
        <FaPlus className="text-success me-2" />
        Registrar Movimiento de Inventario
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded row g-3 registro-movimiento-form"
        autoComplete="off"
      >
        <div className="col-md-5 col-12">
          <label className="form-label">Producto</label>
          <select
            className="form-select"
            name="producto_id"
            value={form.producto_id}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="">Seleccione un producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} ({p.codigo}) — Stock: {p.stock}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2 col-6">
          <label className="form-label">Tipo</label>
          <select
            className="form-select"
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            disabled={loading}
          >
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>
        <div className="col-md-2 col-6">
          <label className="form-label">Cantidad</label>
          <input
            type="number"
            className="form-control"
            name="cantidad"
            value={form.cantidad}
            min={1}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        <div className="col-md-3 col-12">
          <label className="form-label">Descripción</label>
          <input
            className="form-control"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Detalle (opcional)"
            disabled={loading}
          />
        </div>
        <div className="col-12 text-end">
          <button
            type="submit"
            className="btn btn-success w-100 w-md-auto"
            disabled={
              loading ||
              !form.producto_id ||
              !form.tipo ||
              !form.cantidad ||
              !user?.id
            }
          >
            {form.tipo === "entrada" ? (
              <><FaPlus /> Registrar Entrada</>
            ) : (
              <><FaMinus /> Registrar Salida</>
            )}
          </button>
        </div>
      </form>
      <style>{`
        /* Responsive form for Registrar Movimiento */
        @media (max-width: 767.98px) {
          .registro-movimiento-form {
            padding: 1rem !important;
          }
          .registro-movimiento-form > div {
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
          .registro-movimiento-form .btn {
            width: 100% !important;
            margin-top: 0.7rem;
          }
        }
        @media (max-width: 575.98px) {
          .registro-movimiento-form {
            padding: 0.6rem !important;
          }
          h2 {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
