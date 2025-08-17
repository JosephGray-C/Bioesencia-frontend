// src/components/AdminServicios.jsx
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const API_URL = "http://localhost:8080/api/servicios";
const serviciosPorPagina = 8;

async function fetchServicios({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function crearServicio(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function actualizarServicio({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function eliminarServicio(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

function CrearServicioModal({ form, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1050,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: 600,
                    width: "100%",
                    position: "relative",
                    boxShadow: "0 8px 32px #0004",
                }}
            >
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div
                                className="title"
                                style={{ fontWeight: 600, fontSize: 26, marginBottom: 12 }}
                            >
                                Agregar servicio
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <i className="fas fa-tag"></i>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre del servicio"
                                            value={form.nombre}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="detalle"
                                            placeholder="Detalle"
                                            value={form.detalle}
                                            onChange={onChange}
                                            required
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-dollar-sign"></i>
                                        <input
                                            type="number"
                                            name="precio"
                                            placeholder="Precio"
                                            value={form.precio}
                                            onChange={onChange}
                                            required
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="button input-box" style={{ marginTop: 26 }}>
                                        <input type="submit" value="Guardar servicio" />
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
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 18,
                        fontSize: 26,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                    }}
                    title="Cerrar"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

function EditarServicioModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1050,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: 600,
                    width: "100%",
                    position: "relative",
                    boxShadow: "0 8px 32px #0004",
                }}
            >
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
                                Editar servicio
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <i className="fas fa-tag"></i>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre del servicio"
                                            value={editForm.nombre}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="detalle"
                                            placeholder="Detalle"
                                            value={editForm.detalle}
                                            onChange={onChange}
                                            required
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-dollar-sign"></i>
                                        <input
                                            type="number"
                                            name="precio"
                                            placeholder="Precio"
                                            value={editForm.precio}
                                            onChange={onChange}
                                            required
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="button input-box" style={{ marginTop: 26 }}>
                                        <input type="submit" value="Guardar cambios" />
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
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 18,
                        fontSize: 26,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                    }}
                    title="Cerrar"
                >
                    ×
                </button>
            </div>
        </div>
    );
}

export default function AdminServicios() {
    const qc = useQueryClient();

    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [form, setForm] = useState({
        nombre: "",
        detalle: "",
        precio: "",
    });

    const [editForm, setEditForm] = useState({
        id: "",
        nombre: "",
        detalle: "",
        precio: "",
    });

    const { data: servicios = [], isFetching } = useQuery({
        queryKey: ["servicios"],
        queryFn: fetchServicios,
        initialData: () => qc.getQueryData(["servicios"]) || [],
    });

    const showSpinner = isFetching && servicios.length === 0;


    const mCrear = useMutation({
        mutationFn: crearServicio,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["servicios"] });
            setShowForm(false);
            setForm({ nombre: "", detalle: "", precio: "" });
            Swal.fire("¡Creado!", "Servicio agregado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo crear", "error"),
    });

    const mEditar = useMutation({
        mutationFn: actualizarServicio,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["servicios"] });
            setShowEditForm(false);
            Swal.fire("¡Actualizado!", "Servicio modificado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo actualizar", "error"),
    });

    const mEliminar = useMutation({
        mutationFn: eliminarServicio,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["servicios"] });
            Swal.fire("¡Eliminado!", "Servicio borrado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo eliminar", "error"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };

    const clearForm = () => {
        setForm({ nombre: "", detalle: "", precio: "" });
        setShowForm(false);
    };

    const clearEditForm = () => {
        setEditForm({ id: "", nombre: "", detalle: "", precio: "" });
        setShowEditForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mCrear.mutate({
            ...form,
            precio: Number(form.precio),
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        mEditar.mutate({
            id: editForm.id,
            payload: {
                ...editForm,
                precio: Number(editForm.precio),
            },
        });
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar servicio?",
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

    const onEdit = (servicio) => {
        setEditForm({ ...servicio, precio: servicio.precio ?? "" });
        setShowEditForm(true);
    };

    const serviciosFiltrados = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return servicios;
        return servicios.filter(
            (s) =>
                (s.nombre || "").toLowerCase().includes(q) ||
                (s.detalle || "").toLowerCase().includes(q)
        );
    }, [busqueda, servicios]);

    const totalPaginas =
        Math.ceil(serviciosFiltrados.length / serviciosPorPagina) || 1;
    const page = Math.min(paginaActual, totalPaginas);
    const indexPrimero = (page - 1) * serviciosPorPagina;
    const serviciosPagina = serviciosFiltrados.slice(
        indexPrimero,
        indexPrimero + serviciosPorPagina
    );

    return (
        <div className="home-crud">
            {/* HEADER de acciones */}
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
                {/* Search */}
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Buscar servicio"
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
                        + Agregar servicio
                    </button>
                </div>
            </div>

            {/* MODALES */}
            {showForm && (
                <CrearServicioModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                />
            )}
            {showEditForm && (
                <EditarServicioModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={clearEditForm}
                />
            )}

            {/* DATATABLE */}
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
                        <th style={{ padding: 12, width: 110, textAlign: "left" }}>
                            Nombre
                        </th>
                        <th style={{ padding: 12, width: 110, textAlign: "left" }}>
                            Detalle
                        </th>
                        <th style={{ padding: 12, width: 110, textAlign: "center" }}>
                            Precio
                        </th>
                        <th style={{ padding: 12, width: 110, textAlign: "center" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {serviciosPagina.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
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
                                    "No hay servicios"
                                )}
                            </td>
                        </tr>
                    ) : (
                        serviciosPagina.map((s) => (
                            <tr key={s.id} style={{ borderBottom: "1px solid #222" }}>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {s.nombre}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    title={s.detalle}
                                >
                                    {s.detalle?.length > 90
                                        ? s.detalle.slice(0, 90) + "..."
                                        : s.detalle}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {Number(s.precio).toLocaleString("es-CR", {
                                        style: "currency",
                                        currency: "CRC",
                                        minimumFractionDigits: 2,
                                    })}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <button
                                        onClick={() => onEdit(s)}
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
                                        title="Editar servicio"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        style={{
                                            background: "#fff",
                                            color: "#B71C1C",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                        title="Eliminar servicio"
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
                <span
                    style={{
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                    }}
                >
                    Mostrando {serviciosPagina.length} de {serviciosFiltrados.length}
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