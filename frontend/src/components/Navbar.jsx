import React, { useState, useRef, useEffect } from "react";

export default function Navbar({ onLogout, onToggleSidebar, sidebarCollapsed }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  // Cierra el menú usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="navbar navbar-expand bg-white shadow-sm py-2 px-3 border-bottom position-sticky top-0 z-2">
      <div className="container-fluid d-flex align-items-center">
        {/* Botón hamburguesa sidebar (visible en móvil, y rotatorio si sidebar colapsado en desktop) */}
        <button
          onClick={onToggleSidebar}
          className="btn btn-link text-dark me-2 d-lg-inline d-print-none"
          style={{ transition: "transform 0.2s" }}
          title="Menú"
        >
          <i
            className={`bi bi-list`}
            style={{
              fontSize: "1.7rem",
              transform: sidebarCollapsed ? "rotate(90deg)" : "none",
              transition: "transform .25s cubic-bezier(.7,2,.4,1)",
            }}
          />
        </button>

        {/* Título con icono animado */}
        <div className="navbar-brand d-flex align-items-center user-select-none">
          <i
            className="bi bi-box-seam-fill text-warning-emphasis me-2"
            style={{
              fontSize: "2rem",
              animation: "bounceIn 0.6s cubic-bezier(.6,-0.28,.74,.05)",
            }}
          ></i>
          <span className="fs-5 fw-bold text-dark">
            Gestión de Inventario
          </span>
        </div>

        <div className="flex-grow-1" />

        {/* Usuario */}
        <div className="dropdown" ref={dropdownRef}>
          <button
            className="btn d-flex align-items-center p-0 border-0 bg-transparent"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Usuario"
            style={{ minWidth: 0 }}
          >
            <span
              className="avatar bg-primary bg-opacity-25 d-flex align-items-center justify-content-center rounded-circle me-2"
              style={{ width: 40, height: 40 }}
            >
              <i className="bi bi-person-fill fs-4 text-primary"></i>
            </span>
            <span className="fw-semibold text-secondary d-none d-md-inline">
              Administrador
            </span>
            <i className="bi bi-caret-down-fill ms-1 text-muted d-none d-md-inline" style={{ fontSize: 13 }} />
          </button>
          <ul
            className={`dropdown-menu dropdown-menu-end shadow-sm mt-2 ${
              menuOpen ? "show" : ""
            }`}
            style={{ minWidth: 190 }}
          >
            <li>
              <button className="dropdown-item">
                <i className="bi bi-person-circle text-primary me-2"></i>
                Mi Perfil
              </button>
            </li>
            <li>
              <button className="dropdown-item">
                <i className="bi bi-gear text-secondary me-2"></i>
                Configuración
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button onClick={onLogout} className="dropdown-item text-danger">
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes bounceIn {
          0% {transform: scale(.8);}
          50% {transform: scale(1.15);}
          100% {transform: scale(1);}
        }
      `}</style>
    </nav>
  );
}

