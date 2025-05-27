// backend/routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Asegura la carpeta de uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configura Multer para guardar archivos en /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // nombre único: fecha + nombre original
    const uniqueName = Date.now() + "_" + file.originalname.replace(/\s/g, "_");
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Ruta para subir imagen
router.post("/", upload.single("imagen"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se subió ninguna imagen" });
  }
  // Retorna la ruta relativa que usarás en la base de datos
  res.json({
    url: "/uploads/" + req.file.filename,
    filename: req.file.filename,
  });
});

module.exports = router;

