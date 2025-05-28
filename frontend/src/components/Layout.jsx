import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import InventoryPage from "../pages/InventoryPage";
import AddProductPage from "../pages/AddProductPage";
import CategoriesPage from "../pages/CategoriesPage";
import LocationsPage from "../pages/LocationsPage";
import ReportsPage from "../pages/ReportsPage";
import ProductModal from "./ProductModal";
import UsersPage from "../pages/UsersPage";
import BitacoraPage from "./BitacoraPage";
import MovimientosPage from "../pages/MovimientosPage";
import RegistrarMovimientoPage from "../pages/RegistrarMovimientoPage";

import "../styles/Layout.css"; // Importa el CSS responsivo nuevo

export default function Layout({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("inventory");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Detectar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ocultar sidebar automáticamente al cambiar a móvil
  useEffect(() => {
    if (isMobile) setSidebarCollapsed(true);
    else setSidebarCollapsed(false);
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarCollapsed((v) => !v);
  };

  return (
    <div className="layout-root d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div
        className={`sidebar-responsive d-flex flex-column flex-shrink-0 bg-dark text-white transition-all
          ${sidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}
          ${isMobile ? "sidebar-mobile" : ""}`}
      >
        <Sidebar
          currentPage={currentPage}
          onChangePage={setCurrentPage}
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden main-content-responsive">
        <Navbar
          onLogout={onLogout}
          onToggleSidebar={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-grow-1 p-4 overflow-auto main-content-inner">
          <div className="container-fluid py-3">
            <div className="card shadow-sm main-card-responsive">
              <div className="card-body p-4">
                {currentPage === "inventory" && (
                  <InventoryPage onView={setSelectedProduct} />
                )}
                {currentPage === "add-product" && <AddProductPage />}
                {currentPage === "categories" && <CategoriesPage />}
                {currentPage === "locations" && <LocationsPage />}
                {currentPage === "reports" && <ReportsPage />}
                {currentPage === "users" && <UsersPage />}
                {currentPage === "bitacora" && <BitacoraPage />}
                {currentPage === "movimientos" && <MovimientosPage />}
                {currentPage === "registrar-movimiento" && <RegistrarMovimientoPage />}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
