import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../assets/homepage.css";

const API_URL = "http://localhost:8080/api/productos";

// --- Modal Crear ---
function CrearProductoModal({ form, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1200,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}
        >
            <div className="container" style={{
                maxWidth: 600,
                width: "100%",
                position: "relative",
                boxShadow: "0 8px 32px #0004"
            }}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div className="title" style={{ fontWeight: 600, fontSize: 26, marginBottom: 12 }}>
                                Agregar producto
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    {["nombre", "descripcion", "precio", "stock", "imagenUrl"].map(key => (
                                        <div className="input-box" key={key}>
                                            <i className={`fas fa-${key === "nombre" ? "tag" : key === "descripcion" ? "align-left" : key === "precio" ? "dollar-sign" : key === "stock" ? "boxes" : "image"}`}></i>
                                            <input
                                                type={key === "precio" || key === "stock" ? "number" : "text"}
                                                name={key}
                                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                                value={form[key]}
                                                onChange={onChange}
                                                required={["nombre", "precio", "stock"].includes(key)}
                                                min={["precio", "stock"].includes(key) ? 0 : undefined}
                                            />
                                        </div>
                                    ))}
                                    <div className="input-box" style={{ marginBottom: 0 }}>
                                        <label style={{ display: "flex", alignItems: "center", fontWeight: 500, color: "#333" }}>
                                            <input
                                                type="checkbox"
                                                name="activo"
                                                checked={form.activo}
                                                onChange={onChange}
                                                style={{ marginRight: 8 }}
                                            />
                                            Activo
                                        </label>
                                    </div>
                                    <div className="button input-box" style={{ marginTop: 26 }}>
                                        <input
                                            type="submit"
                                            value="Guardar producto"
                                        />
                                    </div>
                                    <div style={{ marginTop: 8, textAlign: "right" }}>
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={{
                                                background: "#6c757d",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "8px 18px",
                                                fontWeight: 500,
                                                fontSize: "1rem",
                                                cursor: "pointer"
                                            }}
                                        >Cancelar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Botón cerrar */}
                <button
                    onClick={onCancel}
                    style={{
                        position: "absolute", top: 12, right: 18, fontSize: 26,
                        background: "none", border: "none", cursor: "pointer", color: "#888"
                    }}
                    title="Cerrar"
                >×</button>
            </div>
        </div>
    );
}

// --- Modal Editar ---
function EditarProductoModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1200,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}
        >
            <div className="container" style={{
                maxWidth: 600,
                width: "100%",
                position: "relative",
                boxShadow: "0 8px 32px #0004"
            }}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div className="title" style={{ fontWeight: 600, fontSize: 26, marginBottom: 12, color: "#5EA743" }}>
                                Editar producto
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    {["nombre", "descripcion", "precio", "stock", "imagenUrl"].map(key => (
                                        <div className="input-box" key={key}>
                                            <i className={`fas fa-${key === "nombre" ? "tag" : key === "descripcion" ? "align-left" : key === "precio" ? "dollar-sign" : key === "stock" ? "boxes" : "image"}`}></i>
                                            <input
                                                type={key === "precio" || key === "stock" ? "number" : "text"}
                                                name={key}
                                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                                value={editForm[key]}
                                                onChange={onChange}
                                                required={["nombre", "precio", "stock"].includes(key)}
                                                min={["precio", "stock"].includes(key) ? 0 : undefined}
                                            />
                                        </div>
                                    ))}
                                    <div className="input-box" style={{ marginBottom: 0 }}>
                                        <label style={{ display: "flex", alignItems: "center", fontWeight: 500, color: "#333" }}>
                                            <input
                                                type="checkbox"
                                                name="activo"
                                                checked={editForm.activo}
                                                onChange={onChange}
                                                style={{ marginRight: 8 }}
                                            />
                                            Activo
                                        </label>
                                    </div>
                                    <div className="button input-box" style={{ marginTop: 26 }}>
                                        <input
                                            type="submit"
                                            value="Guardar cambios"
                                        />
                                    </div>
                                    <div style={{ marginTop: 8, textAlign: "right" }}>
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={{
                                                background: "#6c757d",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "8px 18px",
                                                fontWeight: 500,
                                                fontSize: "1rem",
                                                cursor: "pointer"
                                            }}
                                        >Cancelar</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Botón cerrar */}
                <button
                    onClick={onCancel}
                    style={{
                        position: "absolute", top: 12, right: 18, fontSize: 26,
                        background: "none", border: "none", cursor: "pointer", color: "#888"
                    }}
                    title="Cerrar"
                >×</button>
            </div>
        </div>
    );
}

// --- Componente principal ---
export default function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const productosPorPagina = 6;

    // Modals y forms independientes
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Formulario para crear producto
    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true
    });

    // Formulario para editar producto
    const [editForm, setEditForm] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true
    });

    // Cargar productos
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(setProductos);
    }, []);

    // Cambios en formulario crear
    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Cambios en formulario editar
    const handleEditChange = e => {
        const { name, value, type, checked } = e.target;
        setEditForm(f => ({
            ...f,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Limpiar y cerrar modal crear
    const clearForm = () => {
        setForm({
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            imagenUrl: "",
            activo: true
        });
        setShowForm(false);
    };

    // Limpiar y cerrar modal editar
    const clearEditForm = () => {
        setEditForm({
            id: "",
            nombre: "",
            descripcion: "",
            precio: "",
            stock: "",
            imagenUrl: "",
            activo: true
        });
        setShowEditForm(false);
    };

    // Crear producto
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error(await res.text());
            const nuevo = await res.json();
            setProductos(p => [...p, nuevo]);
            Swal.fire("¡Creado!", "Producto agregado.", "success");
            clearForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Editar producto
    const handleEditSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/${editForm.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            if (!res.ok) throw new Error(await res.text());
            const actualizado = await res.json();
            setProductos(p =>
                p.map(prod => prod.id === actualizado.id ? actualizado : prod)
            );
            Swal.fire("¡Actualizado!", "Producto modificado.", "success");
            clearEditForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Eliminar producto
    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: "¿Eliminar producto?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5A0D0D",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });
        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error(await res.text());
                setProductos(p => p.filter(prod => prod.id !== id));
                Swal.fire("¡Eliminado!", "Producto borrado.", "success");
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    // Preparar datos cuando se va a editar
    const onEdit = prod => {
        setEditForm({ ...prod });
        setShowEditForm(true);
    };

    // Filtrado y paginación
    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    const indexUltimo = paginaActual * productosPorPagina;
    const indexPrimero = indexUltimo - productosPorPagina;
    const productosPagina = productosFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

    return (
        <div className="home-crud">{/* <- Cambia solo esta línea */}
            {/* HEADER de acciones */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                gap: 18,
                width: "100%" // <-- asegura que se estiren a los extremos
            }}>
                {/* Search */}
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Buscar"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            fontSize: 16,
                            width: "100%",
                            maxWidth: 260
                        }}
                    />
                </div>
                {/* Botones */}
                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                    <button
                        onClick={() => setShowForm(true)}
                        style={{
                            background: "#5EA743",
                            color: "#fff",
                            fontWeight: 700,
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 20px",
                            fontSize: 16,
                            cursor: "pointer"
                        }}
                    >
                        + Agregar producto
                    </button>
                </div>
            </div>

            {/* MODALES */}
            {showForm && (
                <CrearProductoModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                />
            )}
            {showEditForm && (
                <EditarProductoModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={clearEditForm}
                />
            )}

            {/* DATATABLE */}
            <table style={{ width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff" }}>
                <thead>
                    <tr style={{ background: "#20232b" }}>
                        <th style={{ padding: 12, minWidth: 100, width: 100, textAlign: "left" }}>Nombre</th>
                        <th style={{ padding: 12, minWidth: 120, width: 100, textAlign: "left" }}>Descripción</th>
                        <th style={{ padding: 12, width: 40, textAlign: "left" }}>Precio</th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>Stock</th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>Activo</th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosPagina.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>No hay productos</td>
                        </tr>
                    ) : (
                        productosPagina.map(prod => (
                            <tr key={prod.id} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{prod.nombre}</td>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{prod.descripcion}</td>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>${prod.precio}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>{prod.stock}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>{prod.activo ? "Sí" : "No"}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    <button
                                        onClick={() => onEdit(prod)}
                                        style={{
                                            marginRight: 8,
                                            background: "#fff",
                                            color: "#FF9800",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer"
                                        }}
                                        title="Editar producto"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id)}
                                        style={{
                                            background: "#fff",
                                            color: "#B71C1C",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer"
                                        }}
                                        title="Eliminar producto"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* FOOTER + PAGINACIÓN */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span style={{ color: "#ccc", display: "block", marginBottom: 8, textAlign: "center" }}>
                    Mostrando {productosPagina.length} de {productosFiltrados.length}
                </span>
                <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPaginaActual(i + 1)}
                            style={{
                                margin: "0 2px",
                                padding: "6px 12px",
                                borderRadius: 6,
                                background: paginaActual === i + 1 ? "#5EA743" : "#444",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer"
                            }}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
