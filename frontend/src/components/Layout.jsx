import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import InventoryPage from "../pages/InventoryPage";
import AddProductPage from "../pages/AddProductPage";
import CategoriesPage from "../pages/CategoriesPage";
import LocationsPage from "../pages/LocationsPage";
import ReportsPage from "../pages/ReportsPage";
import ProductModal from "./ProductModal";

export default function Layout({ onLogout }) {
  const [currentPage, setCurrentPage] = useState("inventory");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <div
        className={`d-flex flex-column flex-shrink-0 bg-dark text-white transition-all ${
          sidebarCollapsed ? "w-60px" : "w-250px"
        }`}
        style={{ transition: "width 0.3s ease" }}
      >
        <Sidebar
          currentPage={currentPage}
          onChangePage={setCurrentPage}
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <Navbar onLogout={onLogout} onToggleSidebar={toggleSidebar} />

        <main className="flex-grow-1 p-4 overflow-auto">
          <div className="container-fluid py-3">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                {currentPage === "inventory" && (
                  <InventoryPage onView={setSelectedProduct} />
                )}
                {currentPage === "add-product" && <AddProductPage />}
                {currentPage === "categories" && <CategoriesPage />}
                {currentPage === "locations" && <LocationsPage />}
                {currentPage === "reports" && <ReportsPage />}
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
