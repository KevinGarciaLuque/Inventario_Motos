import React from "react";
import {
  FaBoxes,
  FaPlus,
  FaTags,
  FaMapMarkerAlt,
  FaChartBar,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const menuItems = [
  { key: "inventory", label: "Inventario", icon: <FaBoxes /> },
  { key: "add-product", label: "Añadir Producto", icon: <FaPlus /> },
  { key: "categories", label: "Categorías", icon: <FaTags /> },
  { key: "locations", label: "Ubicaciones", icon: <FaMapMarkerAlt /> },
  { key: "reports", label: "Reportes", icon: <FaChartBar /> },
];

export default function Sidebar({
  currentPage,
  onChangePage,
  isCollapsed = false,
  onToggle,
  sidebarOpen,
}) {
  return (
    <div
      className={`d-flex flex-column h-100 bg-dark shadow-lg position-relative ${
        isCollapsed ? "align-items-center" : ""
      }`}
      style={{
        minWidth: isCollapsed ? 72 : 250,
        maxWidth: isCollapsed ? 72 : 250,
        transition: "all 0.3s cubic-bezier(.5,2,.5,1)",
        zIndex: 1051,
      }}
    >
      {/* Branding/logo */}
      <div
        className={`d-flex align-items-center justify-content-between px-3 py-3 border-bottom ${
          isCollapsed ? "justify-content-center px-2" : ""
        }`}
      >
        <span
          className="fw-bold fs-4 text-warning-emphasis text-center"
          style={{
            letterSpacing: 2,
            transition: "all .3s",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {isCollapsed ? (
            <span title="Inventario" style={{ fontSize: 30 }}>
              <FaBoxes />
            </span>
          ) : (
            "INVENTARIO"
          )}
        </span>
        {/* Botón colapsar */}
        <button
          className={`btn btn-link text-secondary d-none d-lg-block p-0 ms-auto ${
            isCollapsed ? "mt-1" : ""
          }`}
          style={{ fontSize: 20, transition: "all .25s" }}
          onClick={onToggle}
          tabIndex={-1}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
        </button>
      </div>

      {/* Menú */}
      <nav className="flex-grow-1 py-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onChangePage(item.key)}
            className={`d-flex align-items-center w-100 border-0 bg-transparent px-3 py-2 sidebar-link fs-6 fw-medium text-start position-relative ${
              currentPage === item.key
                ? "text-warning bg-gradient bg-warning bg-opacity-10 shadow-sm"
                : "text-light"
            } ${isCollapsed ? "justify-content-center px-2" : ""}`}
            style={{
              outline: "none",
              borderLeft:
                currentPage === item.key
                  ? "4px solid #ffc107"
                  : "4px solid transparent",
              transition: "all .22s cubic-bezier(.65,1.6,.5,1)",
              minHeight: 44,
            }}
            title={isCollapsed ? item.label : undefined}
          >
            <span
              className={`me-3 d-flex align-items-center fs-5`}
              style={{ minWidth: 24, justifyContent: "center" }}
            >
              {item.icon}
            </span>
            {!isCollapsed && (
              <span className="sidebar-label flex-grow-1">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer ayuda o versión, solo si no está colapsado */}
      {!isCollapsed && (
        <div className="mt-auto px-3 py-2 border-top small text-muted text-center">
          <i className="bi bi-info-circle me-1"></i> Pixel Digital
        </div>
      )}

      <style>{`
        .sidebar-link:focus {
          box-shadow: 0 0 0 .15rem #ffc10766 !important;
        }
        .sidebar-link:hover,
        .sidebar-link:active {
          background: #292929 !important;
          color: #ffc107 !important;
        }
      `}</style>
    </div>
  );
}
