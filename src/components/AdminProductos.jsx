// src/components/AdminProductos.jsx
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const API_URL = "http://localhost:8080/api/productos";
const POR_PAGINA = 6;

async function fetchProductos({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function crearProducto(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function actualizarProducto({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function eliminarProducto(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

function CrearProductoModal({ form, onChange, onSubmit, onCancel }) {
    return (
        <div style={backdrop}>
            <div className="container" style={modal}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div
                                className="title"
                                style={{ fontWeight: 600, fontSize: 26, marginBottom: 12 }}
                            >
                                Agregar producto
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    {[
                                        "nombre",
                                        "descripcion",
                                        "precio",
                                        "stock",
                                        "imagenUrl",
                                    ].map((key) => (
                                        <div className="input-box" key={key}>
                                            <i
                                                className={`fas fa-${key === "nombre"
                                                        ? "tag"
                                                        : key === "descripcion"
                                                            ? "align-left"
                                                            : key === "precio"
                                                                ? "dollar-sign"
                                                                : key === "stock"
                                                                    ? "boxes"
                                                                    : "image"
                                                    }`}
                                            ></i>
                                            <input
                                                type={
                                                    key === "precio" || key === "stock"
                                                        ? "number"
                                                        : "text"
                                                }
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
                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontWeight: 500,
                                                color: "#333",
                                            }}
                                        >
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
                                        <input type="submit" value="Guardar producto" />
                                    </div>
                                    <div style={{ marginTop: 8, textAlign: "right" }}>
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={btnSecondary}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <button onClick={onCancel} style={closeBtn} title="Cerrar">
                    ×
                </button>
            </div>
        </div>
    );
}

function EditarProductoModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div style={backdrop}>
            <div className="container" style={modal}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div
                                className="title"
                                style={{
                                    fontWeight: 600,
                                    fontSize: 26,
                                    marginBottom: 12,
                                    color: "#5EA743",
                                }}
                            >
                                Editar producto
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    {[
                                        "nombre",
                                        "descripcion",
                                        "precio",
                                        "stock",
                                        "imagenUrl",
                                    ].map((key) => (
                                        <div className="input-box" key={key}>
                                            <i
                                                className={`fas fa-${key === "nombre"
                                                        ? "tag"
                                                        : key === "descripcion"
                                                            ? "align-left"
                                                            : key === "precio"
                                                                ? "dollar-sign"
                                                                : key === "stock"
                                                                    ? "boxes"
                                                                    : "image"
                                                    }`}
                                            ></i>
                                            <input
                                                type={
                                                    key === "precio" || key === "stock"
                                                        ? "number"
                                                        : "text"
                                                }
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
                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontWeight: 500,
                                                color: "#333",
                                            }}
                                        >
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
                                        <input type="submit" value="Guardar cambios" />
                                    </div>
                                    <div style={{ marginTop: 8, textAlign: "right" }}>
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={btnSecondary}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <button onClick={onCancel} style={closeBtn} title="Cerrar">
                    ×
                </button>
            </div>
        </div>
    );
}

export default function AdminProductos() {
    const qc = useQueryClient();

    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [form, setForm] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true,
    });

    const [editForm, setEditForm] = useState({
        id: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        imagenUrl: "",
        activo: true,
    });

    const { data: productos = [], isFetching } = useQuery({
        queryKey: ["productos"],
        queryFn: fetchProductos,
        initialData: () => qc.getQueryData(["productos"]) || [],
    });

    const showSpinner = isFetching && productos.length === 0;

    const mCrear = useMutation({
        mutationFn: crearProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            setShowForm(false);
            setForm({
                nombre: "",
                descripcion: "",
                precio: "",
                stock: "",
                imagenUrl: "",
                activo: true,
            });
            Swal.fire("¡Creado!", "Producto agregado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo crear", "error"),
    });

    const mEditar = useMutation({
        mutationFn: actualizarProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            setShowEditForm(false);
            Swal.fire("¡Actualizado!", "Producto modificado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo actualizar", "error"),
    });

    const mEliminar = useMutation({
        mutationFn: eliminarProducto,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["productos"] });
            Swal.fire("¡Eliminado!", "Producto borrado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo eliminar", "error"),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mCrear.mutate({
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock),
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        mEditar.mutate({
            id: editForm.id,
            payload: {
                ...editForm,
                precio: Number(editForm.precio),
                stock: Number(editForm.stock),
            },
        });
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar producto?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5A0D0D",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });
        if (confirm.isConfirmed) mEliminar.mutate(id);
    };

    const onEdit = (prod) => {
        setEditForm({
            id: prod.id,
            nombre: prod.nombre || "",
            descripcion: prod.descripcion || "",
            precio: prod.precio ?? "",
            stock: prod.stock ?? "",
            imagenUrl: prod.imagenUrl || "",
            activo: !!prod.activo,
        });
        setShowEditForm(true);
    };

    const productosFiltrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return productos;
        return productos.filter((p) => (p.nombre || "").toLowerCase().includes(q));
    }, [busqueda, productos]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(productosFiltrados.length / POR_PAGINA)
    );
    const page = Math.min(paginaActual, totalPaginas);
    const start = (page - 1) * POR_PAGINA;
    const productosPagina = productosFiltrados.slice(start, start + POR_PAGINA);
    return (
        <div className="home-crud">
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                    gap: 18,
                    width: "100%",
                }}
            >
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Buscar producto"
                        value={busqueda}
                        onChange={(e) => {
                            setBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            fontSize: 16,
                            width: "100%",
                            maxWidth: 260,
                        }}
                    />
                </div>
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
                            cursor: "pointer",
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
                    onCancel={() => setShowForm(false)}
                />
            )}
            {showEditForm && (
                <EditarProductoModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEditForm(false)}
                />
            )}

            {/* TABLA */}
            <table
                style={{
                    width: "100%",
                    background: "#fff",
                    borderCollapse: "collapse",
                    color: "#000000",
                }}
            >
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th
                            style={{
                                padding: 12,
                                minWidth: 100,
                                width: 100,
                                textAlign: "left",
                            }}
                        >
                            Nombre
                        </th>
                        <th
                            style={{
                                padding: 12,
                                minWidth: 120,
                                width: 100,
                                textAlign: "left",
                            }}
                        >
                            Descripción
                        </th>
                        <th style={{ padding: 12, width: 40, textAlign: "left" }}>
                            Precio
                        </th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>
                            Stock
                        </th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>
                            Activo
                        </th>
                        <th style={{ padding: 12, width: 80, textAlign: "center" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {productosPagina.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                                {showSpinner ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ClipLoader size={18} color="#bbb" speedMultiplier={0.9} />
                                    </span>
                                ) : (
                                    "Sin productos"
                                )}
                            </td>
                        </tr>
                    ) : (
                        productosPagina.map((prod) => (
                            <tr key={prod.id} style={{ borderBottom: "1px solid #222" }}>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.nombre}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.descripcion}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    ₡{prod.precio}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.stock}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {prod.activo ? "Sí" : "No"}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
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
                                            cursor: "pointer",
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
                                            cursor: "pointer",
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

            {/* PAGINACIÓN */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span
                    style={{
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                    }}
                >
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
                                background: page === i + 1 ? "#5EA743" : "#444",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
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

const backdrop = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.25)",
    zIndex: 1200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};
const modal = {
    maxWidth: 600,
    width: "100%",
    position: "relative",
    boxShadow: "0 8px 32px #0004",
};
const btnSecondary = {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontWeight: 500,
    fontSize: "1rem",
    cursor: "pointer",
};
const closeBtn = {
    position: "absolute",
    top: 12,
    right: 18,
    fontSize: 26,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#888",
};