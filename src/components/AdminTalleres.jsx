// src/components/AdminTalleres.jsx
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const API_URL = "http://localhost:8080/api/talleres";
const INS_API = "http://localhost:8080/api/inscripciones";

async function fetchTalleres({ signal }) {
    const res = await fetch(API_URL, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function fetchInscripciones({ signal }) {
    const res = await fetch(INS_API, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

function CrearTallerModal({ form, onChange, onSubmit, onCancel }) {
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
                maxWidth: 700,
                width: "100%",
                position: "relative",
                boxShadow: "0 8px 32px #0004"
            }}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div className="title" style={{ fontWeight: 600, fontSize: 26, marginBottom: 12 }}>
                                Agregar taller
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <i className="fas fa-book"></i>
                                        <input
                                            type="text"
                                            name="titulo"
                                            placeholder="Título"
                                            value={form.titulo}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="descripcion"
                                            placeholder="Descripción"
                                            value={form.descripcion}
                                            onChange={onChange}
                                            required
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaInicio"
                                            placeholder="Fecha inicio"
                                            value={form.fechaInicio}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaFin"
                                            placeholder="Fecha fin"
                                            value={form.fechaFin}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <input
                                            type="text"
                                            name="lugar"
                                            placeholder="Lugar"
                                            value={form.lugar}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-users"></i>
                                        <input
                                            type="number"
                                            name="cupoMaximo"
                                            placeholder="Cupo máximo"
                                            value={form.cupoMaximo}
                                            onChange={onChange}
                                            required
                                            min={1}
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
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="input-box" style={{ marginBottom: 0 }}>
                                        <label style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 500,
                                            color: "#333"
                                        }}>
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
                                        <input type="submit" value="Guardar taller" />
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
                        background: "none", border: "none", cursor: "pointer", color: "#888"
                    }}
                    title="Cerrar"
                >×
                </button>
            </div>
        </div>
    );
}

function EditarTallerModal({ editForm, onChange, onSubmit, onCancel }) {
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
                maxWidth: 700,
                width: "100%",
                position: "relative",
                boxShadow: "0 8px 32px #0004"
            }}>
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div className="title"
                                style={{ fontWeight: 600, fontSize: 26, marginBottom: 12, color: "#5EA743" }}>
                                Editar taller
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <i className="fas fa-book"></i>
                                        <input
                                            type="text"
                                            name="titulo"
                                            placeholder="Título"
                                            value={editForm.titulo}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-align-left"></i>
                                        <textarea
                                            name="descripcion"
                                            placeholder="Descripción"
                                            value={editForm.descripcion}
                                            onChange={onChange}
                                            required
                                            rows={3}
                                            style={{ resize: "vertical", width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaInicio"
                                            placeholder="Fecha inicio"
                                            value={editForm.fechaInicio}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaFin"
                                            placeholder="Fecha fin"
                                            value={editForm.fechaFin}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <input
                                            type="text"
                                            name="lugar"
                                            placeholder="Lugar"
                                            value={editForm.lugar}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-users"></i>
                                        <input
                                            type="number"
                                            name="cupoMaximo"
                                            placeholder="Cupo máximo"
                                            value={editForm.cupoMaximo}
                                            onChange={onChange}
                                            required
                                            min={1}
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
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                    <div className="input-box" style={{ marginBottom: 0 }}>
                                        <label style={{
                                            display: "flex",
                                            alignItems: "center",
                                            fontWeight: 500,
                                            color: "#333"
                                        }}>
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
                        background: "none", border: "none", cursor: "pointer", color: "#888"
                    }}
                    title="Cerrar"
                >×
                </button>
            </div>
        </div>
    );
}

export default function AdminTalleres() {
    const qc = useQueryClient();

    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const talleresPorPagina = 6;

    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    const [form, setForm] = useState({
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        lugar: "",
        cupoMaximo: "",
        precio: "",
        activo: true
    });

    const [editForm, setEditForm] = useState({
        id: "",
        titulo: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
        lugar: "",
        cupoMaximo: "",
        precio: "",
        activo: true
    });

    const {
        data: talleres = [],
        isFetching: isFetchingTalleres,
        refetch: refetchTalleres,
    } = useQuery({
        queryKey: ["talleres"],
        queryFn: fetchTalleres,
        initialData: () => qc.getQueryData(["talleres"]) || [],
    });

    const { data: inscripciones = [] } = useQuery({
        queryKey: ["inscripciones"],
        queryFn: fetchInscripciones,
        initialData: () => qc.getQueryData(["inscripciones"]) || [],
    });

    const showSpinner = isFetchingTalleres && talleres.length === 0;

    const inscripcionesPorTaller = useMemo(() => {
        const mapa = {};
        for (const i of inscripciones) {
            if (i?.tallerId) {
                mapa[i.tallerId] = (mapa[i.tallerId] || 0) + 1;
            }
        }
        return mapa;
    }, [inscripciones]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };
    const handleEditChange = e => {
        const { name, value, type, checked } = e.target;
        setEditForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    };

    const clearForm = () => {
        setForm({
            titulo: "",
            descripcion: "",
            fechaInicio: "",
            fechaFin: "",
            lugar: "",
            cupoMaximo: "",
            precio: "",
            activo: true
        });
        setShowForm(false);
    };
    const clearEditForm = () => {
        setEditForm({
            id: "",
            titulo: "",
            descripcion: "",
            fechaInicio: "",
            fechaFin: "",
            lugar: "",
            cupoMaximo: "",
            precio: "",
            activo: true
        });
        setShowEditForm(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!form.fechaInicio || !form.fechaFin) {
            Swal.fire("Error", "Debes ingresar la fecha y hora de inicio y fin.", "error");
            return;
        }
        const inicio = new Date(form.fechaInicio);
        const fin = new Date(form.fechaFin);
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            Swal.fire("Error", "Fechas inválidas. Por favor selecciona correctamente las fechas y horas.", "error");
            return;
        }
        if (fin <= inicio) {
            Swal.fire("Error", "La fecha/hora de fin debe ser posterior a la de inicio.", "error");
            return;
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error(await res.text());
            const nuevo = await res.json();

            qc.setQueryData(["talleres"], (prev) =>
                Array.isArray(prev) ? [...prev, nuevo] : [nuevo]
            );

            Swal.fire("¡Creado!", "Taller agregado.", "success");
            clearForm();
            refetchTalleres();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleEditSubmit = async e => {
        e.preventDefault();

        if (!editForm.fechaInicio || !editForm.fechaFin) {
            Swal.fire("Error", "Debes ingresar la fecha y hora de inicio y fin.", "error");
            return;
        }
        const inicio = new Date(editForm.fechaInicio);
        const fin = new Date(editForm.fechaFin);
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            Swal.fire("Error", "Fechas inválidas. Por favor selecciona correctamente las fechas y horas.", "error");
            return;
        }
        if (fin <= inicio) {
            Swal.fire("Error", "La fecha/hora de fin debe ser posterior a la de inicio.", "error");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/${editForm.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm)
            });
            if (!res.ok) throw new Error(await res.text());
            const actualizado = await res.json();

            qc.setQueryData(["talleres"], (prev) =>
                Array.isArray(prev) ? prev.map(t => t.id === actualizado.id ? actualizado : t) : prev
            );

            Swal.fire("¡Actualizado!", "Taller modificado.", "success");
            clearEditForm();
            refetchTalleres();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: "¿Eliminar taller?",
            text: "No podrás revertir esto.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#5A0D0D",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
        });
        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());

            qc.setQueryData(["talleres"], (prev) =>
                Array.isArray(prev) ? prev.filter(t => t.id !== id) : prev
            );

            Swal.fire("¡Eliminado!", "Taller borrado.", "success");
            refetchTalleres();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    const handleVerInscritos = (taller) => {
        const lista = inscripciones.filter(i => i.tallerId === taller.id);

        if (!Array.isArray(lista) || lista.length === 0) {
            Swal.fire({
                icon: "info",
                title: "Sin inscripciones",
                text: `No hay usuarios inscritos en "${taller.titulo}".`,
                confirmButtonColor: "#5EA743",
            });
            return;
        }

        const filas = lista.map((i, idx) => `
      <tr>
        <td style="padding:6px;white-space:nowrap;">${idx + 1}</td>
        <td style="padding:6px;white-space:nowrap;">${i.usuarioNombre ?? "—"}</td>
        <td style="padding:6px;white-space:nowrap;">${i.usuarioApellido ?? "—"}</td>
        <td style="padding:6px;white-space:nowrap;">${i.usuarioEmail ?? "—"}</td>
        <td style="padding:6px;white-space:nowrap;">${i.fechaInscripcion ? new Date(i.fechaInscripcion).toLocaleString() : "—"}</td>
        <td style="padding:6px;white-space:nowrap;">${i.estado ?? "—"}</td>
      </tr>
    `).join("");

        const tabla = `
      <div style="max-height:60vh;overflow:auto;text-align:left">
        <p><b>Taller:</b> ${taller.titulo}</p>
        <p style="margin-top:4px"><b>Total inscritos:</b> ${lista.length}</p>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;table-layout:auto;">
            <thead>
              <tr>
                <th style="text-align:left;padding:6px;white-space:nowrap;">#</th>
                <th style="text-align:left;padding:6px;white-space:nowrap;">Nombre</th>
                <th style="text-align:left;padding:6px;white-space:nowrap;">Apellido</th>
                <th style="text-align:left;padding:6px;white-space:nowrap;">Email</th>
                <th style="text-align:left;padding:6px;white-space:nowrap;">Fecha inscrip.</th>
                <th style="text-align:left;padding:6px;white-space:nowrap;">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filas}
            </tbody>
          </table>
        </div>
      </div>`;
        Swal.fire({
            title: "Inscritos",
            html: tabla,
            width: 720,
            confirmButtonColor: "#5EA743",
        });
    };

    // Preparar datos cuando se va a editar
    const onEdit = taller => {
        setEditForm({
            id: taller.id ?? "",
            titulo: taller.titulo ?? "",
            descripcion: taller.descripcion ?? "",
            fechaInicio: taller.fechaInicio ?? "",
            fechaFin: taller.fechaFin ?? "",
            lugar: taller.lugar ?? "",
            cupoMaximo: taller.cupoMaximo ?? "",
            precio: taller.precio ?? "",
            activo: typeof taller.activo === "boolean" ? taller.activo : true
        });
        setShowEditForm(true);
    };

    // Filtrado y paginación
    const talleresFiltrados = useMemo(
        () => (talleres || []).filter(t =>
            t.titulo?.toLowerCase().includes(busqueda.toLowerCase())
        ),
        [talleres, busqueda]
    );

    const indexUltimo = paginaActual * talleresPorPagina;
    const indexPrimero = indexUltimo - talleresPorPagina;
    const talleresPagina = talleresFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(talleresFiltrados.length / talleresPorPagina) || 1;

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
                        placeholder="Buscar por título"
                        value={busqueda}
                        onChange={e => {
                            setBusqueda(e.target.value);
                            setPaginaActual(1);
                        }}
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
                        + Agregar taller
                    </button>
                </div>
            </div>

            {/* MODALES */}
            {showForm && (
                <CrearTallerModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                />
            )}
            {showEditForm && (
                <EditarTallerModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={clearEditForm}
                />
            )}

            {/* DATATABLE */}
            <table style={{ width: "100%", background: "#fff", borderCollapse: "collapse", color: "#000000" }}>
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th style={{ padding: 12, width: 120, textAlign: "left" }}>Título</th>
                        <th style={{ padding: 12, width: 200, textAlign: "left" }}>Descripción</th>
                        <th style={{ padding: 12, width: 145, textAlign: "center" }}>Fecha inicio</th>
                        <th style={{ padding: 12, width: 145, textAlign: "center" }}>Fecha fin</th>
                        <th style={{ padding: 12, width: 200, textAlign: "left" }}>Lugar</th>
                        <th style={{ padding: 12, width: 70, textAlign: "center" }}>Cupo</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Precio</th>
                        <th style={{ padding: 12, width: 70, textAlign: "center" }}>Activo</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Inscritos</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Disponibles</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {talleresPagina.length === 0 ? (
                        <tr>
                            <td colSpan={11} style={{ textAlign: "center", padding: 20 }}>
                                {showSpinner ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <ClipLoader size={18} color="#bbb" speedMultiplier={0.9} />
                                    </span>
                                ) : (
                                    "No hay talleres"
                                )}
                            </td>
                        </tr>
                    ) : (
                        talleresPagina.map(t => (
                            <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{t.titulo}</td>
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                        maxWidth: 320,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}
                                    title={t.descripcion}
                                >
                                    {t.descripcion}
                                </td>
                                <td style={{
                                    padding: 10,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    whiteSpace: "nowrap"
                                }}>
                                    {t.fechaInicio && new Date(t.fechaInicio).toLocaleString()}
                                </td>
                                <td style={{
                                    padding: 10,
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                    whiteSpace: "nowrap"
                                }}>
                                    {t.fechaFin && new Date(t.fechaFin).toLocaleString()}
                                </td>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{t.lugar}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>{t.cupoMaximo}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    {Number(t.precio).toLocaleString("es-CR", {
                                        style: "currency",
                                        currency: "CRC",
                                        minimumFractionDigits: 2
                                    })}
                                </td>
                                <td style={{
                                    padding: 10,
                                    textAlign: "center",
                                    verticalAlign: "middle"
                                }}>{t.activo ? "Sí" : "No"}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    {inscripcionesPorTaller[t.id] || 0}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    {Math.max(0, (t.cupoMaximo || 0) - (inscripcionesPorTaller[t.id] || 0))}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 8
                                    }}>
                                        <button
                                            onClick={() => onEdit(t)}
                                            style={{
                                                background: "#fff",
                                                color: "#FF9800",
                                                border: "none",
                                                borderRadius: 5,
                                                padding: "5px 8px",
                                                fontSize: 16,
                                                cursor: "pointer",
                                                width: 40
                                            }}
                                            title="Editar taller"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleVerInscritos(t)}
                                            style={{
                                                background: "#fff",
                                                color: "#1976D2",
                                                border: "none",
                                                borderRadius: 5,
                                                padding: "5px 8px",
                                                fontSize: 16,
                                                cursor: "pointer",
                                                width: 40
                                            }}
                                            title="Ver inscritos"
                                        >
                                            <i className="fas fa-users"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            style={{
                                                background: "#fff",
                                                color: "#B71C1C",
                                                border: "none",
                                                borderRadius: 5,
                                                padding: "5px 8px",
                                                fontSize: 16,
                                                cursor: "pointer",
                                                width: 40
                                            }}
                                            title="Eliminar taller"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* FOOTER + PAGINACIÓN */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span style={{ color: "#000000", display: "block", marginBottom: 8, textAlign: "center" }}>
                    Mostrando {talleresPagina.length} de {talleresFiltrados.length}
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