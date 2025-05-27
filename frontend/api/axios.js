import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export default api;
// Puedes agregar interceptores si necesitas manejar tokens o errores globalmente