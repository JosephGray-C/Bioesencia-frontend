import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../assets/homepage.css";

const API_URL = "http://localhost:8080/api/servicios";

// --- Modal Crear Servicio ---
function CrearServicioModal({ form, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1050,
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
                                        <input
                                            type="submit"
                                            value="Guardar servicio"
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

// --- Modal Editar Servicio ---
function EditarServicioModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100vw", height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1050,
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
export default function AdminServicios() {
    const [servicios, setServicios] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const serviciosPorPagina = 8;

    // Modals y forms independientes
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Formulario para crear servicio
    const [form, setForm] = useState({
        nombre: "",
        detalle: "",
        precio: ""
    });

    // Formulario para editar servicio
    const [editForm, setEditForm] = useState({
        id: "",
        nombre: "",
        detalle: "",
        precio: ""
    });

    // Cargar servicios
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(setServicios);
    }, []);

    // Cambios en formulario crear
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(f => ({
            ...f,
            [name]: value
        }));
    };

    // Cambios en formulario editar
    const handleEditChange = e => {
        const { name, value } = e.target;
        setEditForm(f => ({
            ...f,
            [name]: value
        }));
    };

    // Limpiar y cerrar modal crear
    const clearForm = () => {
        setForm({
            nombre: "",
            detalle: "",
            precio: ""
        });
        setShowForm(false);
    };

    // Limpiar y cerrar modal editar
    const clearEditForm = () => {
        setEditForm({
            id: "",
            nombre: "",
            detalle: "",
            precio: ""
        });
        setShowEditForm(false);
    };

    // Crear servicio
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
            setServicios(p => [...p, nuevo]);
            Swal.fire("¡Creado!", "Servicio agregado.", "success");
            clearForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Editar servicio
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
            setServicios(p =>
                p.map(s => s.id === actualizado.id ? actualizado : s)
            );
            Swal.fire("¡Actualizado!", "Servicio modificado.", "success");
            clearEditForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Eliminar servicio
    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: "¿Eliminar servicio?",
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
                setServicios(p => p.filter(s => s.id !== id));
                Swal.fire("¡Eliminado!", "Servicio borrado.", "success");
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    // Preparar datos cuando se va a editar
    const onEdit = servicio => {
        setEditForm({ ...servicio });
        setShowEditForm(true);
    };

    // Filtrado y paginación
    const serviciosFiltrados = servicios.filter(s =>
        s.nombre?.toLowerCase().includes(busqueda.toLowerCase())
        || s.detalle?.toLowerCase().includes(busqueda.toLowerCase())
    );
    const indexUltimo = paginaActual * serviciosPorPagina;
    const indexPrimero = indexUltimo - serviciosPorPagina;
    const serviciosPagina = serviciosFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(serviciosFiltrados.length / serviciosPorPagina);

    return (
        <div className="home-crud">
            {/* HEADER de acciones */}
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
                gap: 18,
                width: "100%"
            }}>
                {/* Search */}
                <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        placeholder="Buscar servicio"
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
            <table style={{ width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff" }}>
                <thead>
                    <tr style={{ background: "#20232b" }}>
                        <th style={{ padding: 12, width: 110, textAlign: "left" }}>Nombre</th>
                        <th style={{ padding: 12, width: 110, textAlign: "left" }}>Detalle</th>
                        <th style={{ padding: 12, width: 110, textAlign: "center" }}>Precio</th>
                        <th style={{ padding: 12, width: 110, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {serviciosPagina.length === 0 ? (
                        <tr>
                            <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>No hay servicios</td>
                        </tr>
                    ) : (
                        serviciosPagina.map(s => (
                            <tr key={s.id} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{s.nombre}</td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                        maxWidth: 200,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                    title={s.detalle}
                                >
                                    {s.detalle?.length > 90
                                        ? s.detalle.slice(0, 90) + "..."
                                        : s.detalle}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    {Number(s.precio).toLocaleString("es-CR", { style: "currency", currency: "CRC", minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
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
                                            cursor: "pointer"
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
                                            cursor: "pointer"
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
                <span style={{ color: "#ccc", display: "block", marginBottom: 8, textAlign: "center" }}>
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
