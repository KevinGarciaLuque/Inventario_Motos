import React, { useState } from "react";
import Login from "./components/Login";
import Layout from "./components/Layout";

// Componente principal de la aplicación
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Si no está logueado, muestra Login */}
      {!isLoggedIn ? (
        <Login onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Layout onLogout={() => setIsLoggedIn(false)} />
      )}
    </div>
  );
}
