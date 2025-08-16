// src/components/AdminCitas.jsx
import { useMemo, useState } from "react";
import { useServicios } from "../hooks/useServicios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/api/citas";

async function fetchCitas({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function crearCita(payload) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function actualizarCita({ id, payload }) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

async function eliminarCita(id) {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(await res.text());
    return true;
}

function CrearCitaModal({
    form,
    onChange,
    onSubmit,
    onCancel,
    serviciosDisponibles,
}) {
    const estadosCita = ["AGENDADA", "CANCELADA", "COMPLETADA"];

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
                                Agregar cita
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <input
                                            type="datetime-local"
                                            name="fechaHora"
                                            placeholder="Fecha y hora"
                                            value={form.fechaHora}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            name="duracion"
                                            placeholder="Duración (min)"
                                            value={form.duracion}
                                            onChange={onChange}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="servicio" style={{ marginRight: 8 }}>
                                            Servicio:
                                        </label>
                                        <select
                                            id="servicio"
                                            name="servicio"
                                            value={form.servicio}
                                            onChange={onChange}
                                            style={{ padding: 6, borderRadius: 6 }}
                                            required
                                        >
                                            <option value="">Selecciona un servicio</option>
                                            {serviciosDisponibles.map((s) => (
                                                <option
                                                    key={s.id || s.nombre || s}
                                                    value={s.nombre || s}
                                                >
                                                    {s.nombre || s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="estado">Estado:</label>
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={form.estado}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%", padding: "8px", borderRadius: 6 }}
                                        >
                                            <option value="">Seleccionar estado</option>
                                            {estadosCita.map((e) => (
                                                <option key={e} value={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="notas"
                                            placeholder="Notas"
                                            value={form.notas}
                                            onChange={onChange}
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
                                        />
                                    </div>
                                    <div className="button input-box" style={{ marginTop: 26 }}>
                                        <input type="submit" value="Guardar cita" />
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
                                        >Cancelar
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
                        position: "absolute", top: 12, right: 18, fontSize: 26,
                        background: "none", border: "none", cursor: "pointer", color: "#888",
                    }}
                    title="Cerrar"
                >×
                </button>
            </div>
        </div>
    );
}

function EditarCitaModal({
    editForm,
    onChange,
    onSubmit,
    onCancel,
    serviciosDisponibles,
}) {
    const estadosCita = ["AGENDADA", "CANCELADA", "COMPLETADA"];

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
                                Editar cita
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <input
                                            type="datetime-local"
                                            name="fechaHora"
                                            placeholder="Fecha y hora"
                                            value={editForm.fechaHora}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            name="duracion"
                                            placeholder="Duración (min)"
                                            value={editForm.duracion}
                                            onChange={onChange}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="servicio" style={{ marginRight: 8 }}>
                                            Servicio:
                                        </label>
                                        <select
                                            id="servicio"
                                            name="servicio"
                                            value={editForm.servicio}
                                            onChange={onChange}
                                            style={{ padding: 6, borderRadius: 6 }}
                                            required
                                        >
                                            <option value="">Selecciona un servicio</option>
                                            {serviciosDisponibles.map((s) => (
                                                <option
                                                    key={s.id || s.nombre || s}
                                                    value={s.nombre || s}
                                                >
                                                    {s.nombre || s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="estado">Estado:</label>
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={editForm.estado}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%", padding: "8px", borderRadius: 6 }}
                                        >
                                            {estadosCita.map((e) => (
                                                <option key={e} value={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="notas"
                                            placeholder="Notas"
                                            value={editForm.notas}
                                            onChange={onChange}
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
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

export default function AdminCitas() {
    const qc = useQueryClient();

    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const citasPorPagina = 8; // <-- ahora SÍ se usa en toda la paginación
    const serviciosDisponibles = useServicios();

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [form, setForm] = useState({
        usuarioId: "",
        fechaHora: "",
        duracion: 60,
        servicio: "",
        estado: "AGENDADA",
        notas: "",
    });

    const [editForm, setEditForm] = useState({
        id: "",
        fechaHora: "",
        duracion: 60,
        servicio: "",
        estado: "AGENDADA",
        notas: "",
        usuario: {},
    });

    const { data: citas = [], isFetching } = useQuery({
        queryKey: ["citas"],
        queryFn: fetchCitas,
        initialData: () => qc.getQueryData(["citas"]) || [],
    });

    const showSpinner = isFetching && citas.length === 0;

    const mCrear = useMutation({
        mutationFn: crearCita,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["citas"] });
            setShowForm(false);
            setForm({
                usuarioId: "",
                fechaHora: "",
                duracion: 60,
                servicio: "",
                estado: "AGENDADA",
                notas: "",
            });
            Swal.fire("¡Creada!", "Cita agregada.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo crear", "error"),
    });

    const mEditar = useMutation({
        mutationFn: actualizarCita,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["citas"] });
            setShowEditForm(false);
            Swal.fire("¡Actualizada!", "Cita modificada.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo actualizar", "error"),
    });

    const mEliminar = useMutation({
        mutationFn: eliminarCita,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["citas"] });
            Swal.fire("¡Eliminada!", "Cita borrada.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo eliminar", "error"),
    });

    // Handlers formularios
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };

    const clearForm = () => {
        setForm({
            usuarioId: "",
            fechaHora: "",
            duracion: 60,
            servicio: "",
            estado: "AGENDADA",
            notas: "",
        });
        setShowForm(false);
    };

    const clearEditForm = () => {
        setEditForm({
            id: "",
            fechaHora: "",
            duracion: 60,
            servicio: "",
            estado: "AGENDADA",
            notas: "",
            usuario: null,
        });
        setShowEditForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.usuarioId) {
            Swal.fire("Error", "Debes seleccionar un usuario.", "error");
            return;
        }
        const payload = {
            ...form,
            usuario: { id: form.usuarioId },
        };
        delete payload.usuarioId;
        mCrear.mutate(payload);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...editForm };
        delete payload.usuario;
        mEditar.mutate({ id: editForm.id, payload });
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar cita?",
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

    const onEdit = (cita) => {
        setEditForm({
            id: cita.id,
            fechaHora: cita.fechaHora,
            duracion: cita.duracion,
            servicio: cita.servicio,
            estado: cita.estado,
            notas: cita.notas,
            usuario: cita.usuario || null,
        });
        setShowEditForm(true);
    };

    // Filtrado y paginación
    const citasFiltradas = useMemo(() => {
        const q = busqueda.toLowerCase();
        return citas.filter(
            (c) =>
                c.servicio?.toLowerCase().includes(q) ||
                c.estado?.toLowerCase().includes(q) ||
                c.notas?.toLowerCase().includes(q)
        );
    }, [citas, busqueda]);

    const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina) || 1;
    const page = Math.min(paginaActual, totalPaginas);
    const indexPrimero = (page - 1) * citasPorPagina;
    const citasPagina = citasFiltradas.slice(
        indexPrimero,
        indexPrimero + citasPorPagina
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
                        placeholder="Buscar cita"
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
                        + Agregar cita
                    </button>
                </div>
            </div>

            {/* MODALES */}
            {showForm && (
                <CrearCitaModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                    serviciosDisponibles={serviciosDisponibles}
                />
            )}
            {showEditForm && (
                <EditarCitaModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={clearEditForm}
                    serviciosDisponibles={serviciosDisponibles}
                />
            )}

            {/* DATATABLE */}
            <table
                style={{
                    width: "100%",
                    background: "#23272f",
                    borderCollapse: "collapse",
                    color: "#fff",
                }}
            >
                <thead>
                    <tr style={{ background: "#20232b" }}>
                        <th style={{ padding: 12, textAlign: "left" }}>Fecha y hora</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Servicio</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Usuario</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Correo</th>
                        <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Notas</th>
                        <th style={{ padding: 12, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {citasPagina.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
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
                                    "No hay citas"
                                )}
                            </td>
                        </tr>
                    ) : (
                        citasPagina.map((c) => (
                            <tr key={c.id} style={{ borderBottom: "1px solid #222" }}>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.fechaHora?.replace("T", " ").slice(0, 16)}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.servicio}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.usuarioNombre ?? "—"}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.usuarioCorreo ?? "—"}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.estado}
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
                                    title={c.notas}
                                >
                                    {c.notas?.length > 90
                                        ? c.notas.slice(0, 90) + "..."
                                        : c.notas}
                                </td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    <button
                                        onClick={() => onEdit(c)}
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
                                        title="Editar cita"
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(c.id)}
                                        style={{
                                            background: "#fff",
                                            color: "#B71C1C",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "5px 8px",
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                        title="Eliminar cita"
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
                        color: "#ccc",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                    }}
                >
                    Mostrando {citasPagina.length} de {citasFiltradas.length}
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