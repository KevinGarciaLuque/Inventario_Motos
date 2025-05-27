import React, { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AddProductPage() {
  const [categorias, setCategorias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    categoria_id: "",
    ubicacion_id: "",
    stock: 0,
    stock_minimo: 1,
    precio: "",
    imagen: "",
  });
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categorias").then((res) => setCategorias(res.data));
    api.get("/ubicaciones").then((res) => setUbicaciones(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";
    if (imagenFile) {
      const formData = new FormData();
      formData.append("imagen", imagenFile);
      try {
        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // ⬇️ El backend devuelve { filename, path }
        imageUrl = res.data.path;
      } catch (err) {
        alert("Error al subir la imagen");
        setLoading(false);
        return;
      }
    }

    try {
      await api.post("/productos", {
        ...form,
        imagen: imageUrl, // Guarda el path "/uploads/..."
      });
      alert("Producto agregado correctamente");
      setForm({
        codigo: "",
        nombre: "",
        descripcion: "",
        categoria_id: "",
        ubicacion_id: "",
        stock: 0,
        stock_minimo: 1,
        precio: "",
        imagen: "",
      });
      setImagenFile(null);
      setPreview(null);
    } catch (error) {
      alert("Error al agregar el producto");
    }
    setLoading(false);
  };

  return (
    <section className="container py-4">
      <h2 className="mb-4 text-center">Añadir Nuevo Repuesto</h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow rounded row g-3"
      >
        <div className="col-md-4">
          <label className="form-label">Código</label>
          <input
            className="form-control"
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Nombre</label>
          <input
            className="form-control"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Ubicación</label>
          <select
            className="form-select"
            name="ubicacion_id"
            value={form.ubicacion_id}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar</option>
            {ubicaciones.map((ub) => (
              <option key={ub.id} value={ub.id}>
                {ub.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={form.stock}
            min={0}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Stock mínimo</label>
          <input
            type="number"
            className="form-control"
            name="stock_minimo"
            value={form.stock_minimo}
            min={1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Precio</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-8">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            name="descripcion"
            rows={2}
            value={form.descripcion}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="col-md-6">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="preview"
                className="img-thumbnail"
                style={{ maxHeight: 150 }}
              />
            </div>
          )}
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-warning w-100"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Producto"}
          </button>
        </div>
      </form>
    </section>
  );
}
