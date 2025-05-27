const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    const user = rows[0];

    // Solo si tu password está hasheado (opcional):
    // const match = await bcrypt.compare(password, user.password);

    // Si NO está hasheada (como el demo):
    const match = password === user.password;

    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // JWT opcional:
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error });
  }
});

module.exports = router;
