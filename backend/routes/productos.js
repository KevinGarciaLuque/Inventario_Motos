// routes/productos.js

const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los productos
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

// Agregar un producto
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
    } = req.body;

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
    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto", error });
  }
});

// Editar producto
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
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar producto", error });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM productos WHERE id=?", [id]);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto", error });
  }
});

module.exports = router;
