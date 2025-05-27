import React, { useState } from "react";
import api from "../../api/axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@motorepuestos.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // Si el backend responde con token y usuario
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.user); // puedes pasar el usuario si lo quieres en el estado global
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Error de conexión o credenciales incorrectas"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-warning w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Iniciar Sesión"}
                </button>

                <div className="text-center text-muted small">
                  <p className="mb-1">Credenciales de demostración:</p>
                  <p className="mb-0">Email: admin@motorepuestos.com</p>
                  <p>Contraseña: admin123</p>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-3">
            <small className="text-muted">
              © {new Date().getFullYear()} MotoRepuestos Inc.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
