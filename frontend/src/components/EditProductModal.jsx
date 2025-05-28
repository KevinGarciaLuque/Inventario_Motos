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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImagenFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = form.imagen;

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

    try {
      await api.put(`/productos/${product.id}`, {
        ...form,
        imagen: imageUrl,
      });
      alert("Producto actualizado correctamente");
      onUpdated();
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
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 2000 }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-dialog-centered modal-responsive-edit">
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
              aria-label="Cerrar"
            />
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6 col-12">
                <label className="form-label">Código</label>
                <input
                  className="form-control"
                  name="codigo"
                  value={form.codigo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 col-12">
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
              <div className="col-md-6 col-12">
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
              <div className="col-md-4 col-12">
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
              <div className="col-md-4 col-12">
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
              <div className="col-md-4 col-12">
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
              <div className="col-12 col-sm-6">
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
                      style={{ maxHeight: 90, maxWidth: "100%" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer bg-light flex-column flex-sm-row gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary w-100 w-sm-auto"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary w-100 w-sm-auto"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
      {/* Estilos responsivos */}
      <style>{`
        @media (max-width: 991.98px) {
          .modal-responsive-edit {
            max-width: 98vw !important;
            min-width: 0 !important;
            margin: 1rem !important;
          }
        }
        @media (max-width: 767.98px) {
          .modal-responsive-edit {
            max-width: 99vw !important;
            margin: 0.5rem !important;
          }
        }
        @media (max-width: 575.98px) {
          .modal-responsive-edit {
            max-width: 100vw !important;
            margin: 0.2rem !important;
          }
          .modal-content {
            border-radius: 14px !important;
            padding: 0.4rem 0.2rem !important;
          }
        }
        /* Botones stack en móvil */
        @media (max-width: 575.98px) {
          .modal-footer {
            flex-direction: column !important;
            gap: 0.6rem !important;
          }
        }
        /* Inputs más grandes y cómodos en móvil */
        @media (max-width: 575.98px) {
          .form-control, .form-select {
            font-size: 1.07rem !important;
            min-height: 2.4rem !important;
          }
        }
      `}</style>
    </div>
  );
}
