// server.js
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Rutas
const authRoutes = require("./routes/auth");
const productosRoutes = require("./routes/productos");
const categoriasRoutes = require("./routes/categorias");
const ubicacionesRoutes = require("./routes/ubicaciones");
const movimientosRoutes = require("./routes/movimientos");
const uploadRoutes = require("./routes/upload");

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Cambia esto por tu frontend en producción
    credentials: true,
  })
);

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/api/movimientos", movimientosRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // para servir imágenes

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);
