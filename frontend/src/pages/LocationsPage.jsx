import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function LocationsPage() {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // Para edición
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      const res = await api.get("/ubicaciones");
      setUbicaciones(res.data);
    } catch {
      window.alert("Error al cargar ubicaciones");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarUbicaciones();
  }, []);

  // Agregar ubicación
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post("/ubicaciones", { nombre, descripcion });
      setNombre("");
      setDescripcion("");
      await cargarUbicaciones();
      window.alert("Ubicación agregada correctamente");
    } catch {
      window.alert("Error al agregar la ubicación");
    }
  };

  // Eliminar ubicación
  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar esta ubicación?")) {
      try {
        await api.delete(`/ubicaciones/${id}`);
        await cargarUbicaciones();
        window.alert("Ubicación eliminada correctamente");
      } catch {
        window.alert("No se pudo eliminar la ubicación (puede estar en uso)");
      }
    }
  };

  // Abrir modal de edición
  const openEdit = (ub) => {
    setEditId(ub.id);
    setEditNombre(ub.nombre);
    setEditDescripcion(ub.descripcion);
    setShowEdit(true);
  };

  // Guardar edición
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/ubicaciones/${editId}`, {
        nombre: editNombre,
        descripcion: editDescripcion,
      });
      setShowEdit(false);
      setEditId(null);
      await cargarUbicaciones();
      window.alert("Ubicación editada correctamente");
    } catch {
      window.alert("Error al editar la ubicación");
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-3 text-center">Ubicaciones</h3>
      {/* FORMULARIO RESPONSIVO */}
      <form onSubmit={handleAdd} className="mb-3 row g-2 locations-form">
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
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </form>
      {/* TABLA RESPONSIVA */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle locations-table">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th style={{ width: 150 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ubicaciones.map((ub) => (
              <tr key={ub.id}>
                <td>{ub.nombre}</td>
                <td style={{ wordBreak: "break-word" }}>{ub.descripcion}</td>
                <td>
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => openEdit(ub)}
                  >
                    <i className="bi bi-pencil-square"></i> Editar
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(ub.id)}
                  >
                    <i className="bi bi-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {ubicaciones.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center text-muted">
                  {loading ? "Cargando..." : "No hay ubicaciones"}
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
          <div className="modal-dialog modal-dialog-centered locations-modal">
            <div className="modal-content">
              <form onSubmit={handleEdit}>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil-square me-2"></i>Editar Ubicación
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
          .locations-form > div {
            margin-bottom: 0.5rem !important;
          }
        }
        @media (max-width: 767.98px) {
          .locations-form > div {
            width: 100% !important;
            max-width: 100% !important;
            flex: 0 0 100% !important;
          }
        }
        /* Tabla responsiva */
        @media (max-width: 575.98px) {
          .locations-table th,
          .locations-table td {
            font-size: 0.99rem !important;
            padding: 0.34rem 0.45rem !important;
            vertical-align: middle;
          }
          .locations-table th {
            min-width: 75px;
          }
        }
        /* Modal edición responsivo */
        @media (max-width: 575.98px) {
          .locations-modal {
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
