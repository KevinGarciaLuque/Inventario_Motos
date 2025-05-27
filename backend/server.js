const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Rutas API
app.use("/api/auth", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/categorias", require("./routes/categorias"));
app.use("/api/ubicaciones", require("./routes/ubicaciones"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/bitacora", require("./routes/bitacora")); // solo si la usas
app.use("/api/upload", require("./routes/upload")); // <-- aquí va upload

// Carpeta de archivos estáticos (imágenes subidas)
app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

