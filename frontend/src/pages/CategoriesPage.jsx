import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function CategoriesPage() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // Para edición
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch {
      window.alert("Error al cargar categorías");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Agregar categoría
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categorias", { nombre, descripcion });
      setNombre("");
      setDescripcion("");
      await cargarCategorias();
      window.alert("Categoría agregada correctamente");
    } catch {
      window.alert("Error al agregar la categoría");
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta categoría?")) {
      try {
        await api.delete(`/categorias/${id}`);
        await cargarCategorias();
        window.alert("Categoría eliminada correctamente");
      } catch {
        window.alert("No se pudo eliminar la categoría (puede estar en uso)");
      }
    }
  };

  // Abrir modal de edición
  const openEdit = (cat) => {
    setEditId(cat.id);
    setEditNombre(cat.nombre);
    setEditDescripcion(cat.descripcion);
    setShowEdit(true);
  };

  // Guardar edición
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categorias/${editId}`, {
        nombre: editNombre,
        descripcion: editDescripcion,
      });
      setShowEdit(false);
      setEditId(null);
      await cargarCategorias();
      window.alert("Categoría editada correctamente");
    } catch {
      window.alert("Error al editar la categoría");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3 text-center">Categorías</h3>
      {/* FORMULARIO RESPONSIVO */}
      <form onSubmit={handleAdd} className="mb-3 row g-2 categories-form">
        <div className="col-md-4 col-12">
          <input
            className="form-control"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="col-md-5 col-12">
          <input
            className="form-control"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="col-md-3 col-12 d-grid">
          <button
            className="btn btn-warning w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </form>

      {/* TABLA RESPONSIVA */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle categories-table">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th style={{ width: 150 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.nombre}</td>
                <td style={{ wordBreak: "break-word" }}>{cat.descripcion}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => openEdit(cat)}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(cat.id)}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {categorias.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  {loading ? "Cargando..." : "No hay categorías"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL EDICIÓN RESPONSIVO */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog modal-dialog-centered categories-modal">
            <div className="modal-content">
              <form onSubmit={handleEdit}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>Editar Categoría
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowEdit(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      className="form-control"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                      className="form-control"
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light flex-column flex-sm-row gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 w-sm-auto"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary w-100 w-sm-auto" type="submit">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS RESPONSIVOS */}
      <style>{`
        /* Formulario responsivo */
        @media (max-width: 991.98px) {
          .categories-form > div {
            margin-bottom: 0.5rem !important;
          }
        }
        @media (max-width: 767.98px) {
          .categories-form > div {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
          }
        }
        /* Tabla responsiva */
        @media (max-width: 575.98px) {
          .categories-table th,
          .categories-table td {
            font-size: 0.99rem !important;
            padding: 0.34rem 0.45rem !important;
            vertical-align: middle;
          }
          .categories-table th {
            min-width: 75px;
          }
        }
        /* Modal edición responsivo */
        @media (max-width: 575.98px) {
          .categories-modal {
            max-width: 98vw !important;
            margin: 0.6rem !important;
          }
          .modal-content {
            border-radius: 13px !important;
          }
          .modal-title {
            font-size: 1.07rem !important;
          }
          .modal-footer {
            flex-direction: column !important;
            gap: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
}
