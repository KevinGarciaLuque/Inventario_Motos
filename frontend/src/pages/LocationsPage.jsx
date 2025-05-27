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

  // Leer ubicaciones
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
      <h3 className="mb-3">Ubicaciones</h3>
      <form onSubmit={handleAdd} className="mb-3 row g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </form>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
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
                <td>{ub.descripcion}</td>
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

      {/* Modal de edición */}
      {showEdit && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.3)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
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
                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEdit(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
