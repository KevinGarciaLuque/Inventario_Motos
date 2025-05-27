import React, { useState, useEffect } from "react";
import api from "../../api/axios";

// Cambia si usas otra url
const API_URL = "http://localhost:5000";

export default function EditProductModal({
  show,
  product,
  categorias,
  ubicaciones,
  onClose,
  onUpdated,
}) {
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

  // Cuando cambie el producto, llena el formulario
  useEffect(() => {
    if (product) {
      setForm({
        codigo: product.codigo || "",
        nombre: product.nombre || "",
        descripcion: product.descripcion || "",
        categoria_id: product.categoria_id || "",
        ubicacion_id: product.ubicacion_id || "",
        stock: product.stock || 0,
        stock_minimo: product.stock_minimo || 1,
        precio: product.precio || "",
        imagen: product.imagen || "",
      });
      setPreview(
        product.imagen
          ? product.imagen.startsWith("http")
            ? product.imagen
            : product.imagen.startsWith("/uploads")
            ? API_URL + product.imagen
            : API_URL + "/uploads/" + product.imagen
          : null
      );
      setImagenFile(null);
    }
  }, [product]);

  if (!show) return null;

  // Para actualizar campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Imagen (opcional)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.imagen;

    // Si se cambió imagen, sube primero
    if (imagenFile) {
      const formData = new FormData();
      formData.append("imagen", imagenFile);
      try {
        const res = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.filename || res.data.url;
      } catch (err) {
        alert("Error al subir la imagen");
        setLoading(false);
        return;
      }
    }

    // Actualiza el producto
    try {
      await api.put(`/productos/${product.id}`, {
        ...form,
        imagen: imageUrl,
      });
      alert("Producto actualizado correctamente");
      onUpdated(); // Refresca lista padre
      onClose();
    } catch (error) {
      alert("Error al actualizar el producto");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered">
        <form
          className="modal-content border-0 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Editar Producto</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Código</label>
                <input
                  className="form-control"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  name="descripcion"
                  rows={2}
                  value={form.descripcion}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="col-6">
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
                      style={{ maxHeight: 90 }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer bg-light">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
