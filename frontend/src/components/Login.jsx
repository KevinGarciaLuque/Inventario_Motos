import React, { useState } from "react";
import api from "../../api/axios";
import { useUser } from "../context/UserContext";
import "../styles/Login.css"; // Asegúrate de tener el CSS

export default function Login() {
  const { login } = useUser();

  const [email, setEmail] = useState("admin@motorepuestos.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      localStorage.setItem("token", res.data.token);
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
    <div className="login-bg min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row login-row align-items-center justify-content-center min-vh-100">
          {/* Columna izquierda: Título */}
          <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center align-items-center">
            <h1 className="inicio-titulo text-white text-center w-100">
              RESPUESTOS<br />DE MOTOS
            </h1>
          </div>
          {/* Columna derecha: Login */}
          <div className="col-12 col-md-8 col-lg-5 mx-auto">
            <div className="card shadow-sm login-card">
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
    </div>
  );
}
