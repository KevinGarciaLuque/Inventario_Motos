import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function UsersPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "usuario",
  });
  const [editUser, setEditUser] = useState(null);

  // Cargar usuarios
  const cargarUsuarios = async () => {
    const res = await api.get("/usuarios");
    setUsuarios(res.data);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Crear o actualizar usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        // Editar usuario (no cambia contraseña)
        await api.put(`/usuarios/${editUser.id}`, {
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
        });
        setEditUser(null);
      } else {
        // Crear usuario
        await api.post("/usuarios", form);
      }
      setForm({ nombre: "", email: "", password: "", rol: "usuario" });
      cargarUsuarios();
      alert("Usuario guardado correctamente");
    } catch (err) {
      alert(
        err.response?.data?.message || "Error al guardar usuario"
      );
    }
  };

  // Editar usuario (llena el form)
  const handleEdit = (user) => {
    setEditUser(user);
    setForm({
      nombre: user.nombre,
      email: user.email,
      password: "",
      rol: user.rol,
    });
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Seguro que deseas eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      await api.delete(`/usuarios/${id}`);
      cargarUsuarios();
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (id) => {
    const newPass = window.prompt("Nueva contraseña:");
    if (!newPass) return;
    await api.put(`/usuarios/${id}/password`, { password: newPass });
    alert("Contraseña actualizada");
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Usuarios</h3>
      <form onSubmit={handleSubmit} className="row g-2 align-items-end mb-4">
        <div className="col-md-3">
          <input
            className="form-control"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        {!editUser && (
          <div className="col-md-3">
            <input
              className="form-control"
              name="password"
              placeholder="Contraseña"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="col-md-2">
          <select
            className="form-select"
            name="rol"
            value={form.rol}
            onChange={handleChange}
          >
            <option value="admin">Administrador</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100">
            {editUser ? "Actualizar" : "Agregar"}
          </button>
        </div>
        {editUser && (
          <div className="col-md-12">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setEditUser(null);
                setForm({ nombre: "", email: "", password: "", rol: "usuario" });
              }}
            >
              Cancelar edición
            </button>
          </div>
        )}
      </form>
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Creado en</th>
              <th style={{ width: 170 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge bg-${u.rol === "admin" ? "primary" : "secondary"}`}>
                    {u.rol}
                  </span>
                </td>
                <td>{u.creado_en && u.creado_en.split("T")[0]}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-1"
                    onClick={() => handleEdit(u)}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-1"
                    onClick={() => handleDelete(u.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleChangePassword(u.id)}
                  >
                    <i className="bi bi-key"></i>
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay usuarios
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
