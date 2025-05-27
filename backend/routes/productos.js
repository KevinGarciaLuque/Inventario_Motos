// routes/productos.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// ========================
// Obtener todos los productos
// ========================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, c.nombre AS categoria, u.nombre AS ubicacion
       FROM productos p
       LEFT JOIN categorias c ON p.categoria_id = c.id
       LEFT JOIN ubicaciones u ON p.ubicacion_id = u.id`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos", error });
  }
});

// ========================
// Agregar un producto (REGISTRA EN BITÁCORA)
// ========================
router.post("/", async (req, res) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      categoria_id,
      ubicacion_id,
      stock,
      stock_minimo,
      precio,
      imagen,
      usuario_id, // <-- 1. Recibe el usuario que está haciendo la acción
    } = req.body;

    // 2. Insertar el producto normalmente
    await db.query(
      `INSERT INTO productos (codigo, nombre, descripcion, categoria_id, ubicacion_id, stock, stock_minimo, precio, imagen)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        nombre,
        descripcion,
        categoria_id,
        ubicacion_id,
        stock,
        stock_minimo,
        precio,
        imagen,
      ]
    );

    // 3. Registrar en la bitácora SOLO si viene usuario_id
    if (usuario_id) {
      await db.query(
        "INSERT INTO bitacora (usuario_id, accion, descripcion) VALUES (?, ?, ?)",
        [
          usuario_id,
          "Agregar producto",
          `Producto "${nombre}" (código: ${codigo}) agregado.`,
        ]
      );
    }

    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto", error });
  }
});

// ========================
// Editar producto (REGISTRA EN BITÁCORA)
// ========================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      nombre,
      descripcion,
      categoria_id,
      ubicacion_id,
      stock,
      stock_minimo,
      precio,
      imagen,
      usuario_id, // <-- Recibe el usuario que hace la acción
    } = req.body;

    await db.query(
      `UPDATE productos SET codigo=?, nombre=?, descripcion=?, categoria_id=?, ubicacion_id=?, stock=?, stock_minimo=?, precio=?, imagen=?
       WHERE id=?`,
      [
        codigo,
        nombre,
        descripcion,
        categoria_id,
        ubicacion_id,
        stock,
        stock_minimo,
        precio,
        imagen,
        id,
      ]
    );

    // Registrar en bitácora si hay usuario_id
    if (usuario_id) {
      await db.query(
        "INSERT INTO bitacora (usuario_id, accion, descripcion) VALUES (?, ?, ?)",
        [
          usuario_id,
          "Editar producto",
          `Producto "${nombre}" (ID: ${id}) editado.`,
        ]
      );
    }

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
});

// ========================
// Eliminar producto (REGISTRA EN BITÁCORA)
// ========================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id } = req.body; // <-- Recibe usuario_id en el body del DELETE (desde frontend)

    // Trae el nombre antes de borrar (opcional, para la descripción)
    let producto = null;
    try {
      const [prods] = await db.query("SELECT nombre, codigo FROM productos WHERE id=?", [id]);
      producto = prods[0];
    } catch {}

    await db.query("DELETE FROM productos WHERE id=?", [id]);

    // Registrar en bitácora
    if (usuario_id) {
      await db.query(
        "INSERT INTO bitacora (usuario_id, accion, descripcion) VALUES (?, ?, ?)",
        [
          usuario_id,
          "Eliminar producto",
          `Producto "${producto?.nombre || ''}" (ID: ${id}) eliminado.`,
        ]
      );
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
});

module.exports = router;

