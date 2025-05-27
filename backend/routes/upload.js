// routes/upload.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("imagen"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ error: "No se subió ninguna imagen" });
  res.json({
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
