const express = require("express");
const router = express.Router();
const db = require("../db");

// Obtener todos los movimientos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, p.nombre AS producto, u.nombre AS usuario
       FROM movimientos m
       LEFT JOIN productos p ON m.producto_id = p.id
       LEFT JOIN usuarios u ON m.usuario_id = u.id
       ORDER BY m.fecha DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener movimientos", error });
  }
});

// Agregar un movimiento (entrada o salida)
router.post("/", async (req, res) => {
  try {
    const { producto_id, tipo, cantidad, descripcion, usuario_id } = req.body;
    await db.query(
      "INSERT INTO movimientos (producto_id, tipo, cantidad, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)",
      [producto_id, tipo, cantidad, descripcion, usuario_id]
    );
    // Actualiza el stock automáticamente según el tipo de movimiento
    if (tipo === "entrada") {
      await db.query("UPDATE productos SET stock = stock + ? WHERE id = ?", [
        cantidad,
        producto_id,
      ]);
    } else if (tipo === "salida") {
      await db.query("UPDATE productos SET stock = stock - ? WHERE id = ?", [
        cantidad,
        producto_id,
      ]);
    }
    res.json({ message: "Movimiento registrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar movimiento", error });
  }
});

// Eliminar un movimiento
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM movimientos WHERE id=?", [id]);
    res.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar movimiento", error });
  }
});

module.exports = router;
