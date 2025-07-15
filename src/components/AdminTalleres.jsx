import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/api/talleres";

// --- Modal Crear ---
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
                                            value="Guardar taller"
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

// --- Modal Editar ---
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
                            <div className="title" style={{ fontWeight: 600, fontSize: 26, marginBottom: 12, color: "#5EA743" }}>
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
export default function AdminTalleres() {
    const [talleres, setTalleres] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const talleresPorPagina = 6;

    // Modals y forms independientes
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Formulario para crear taller
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

    // Formulario para editar taller
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

    // Cargar talleres
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(setTalleres);
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

    // Limpiar y cerrar modal editar
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

    // Crear taller
    const handleSubmit = async e => {
        e.preventDefault();

        // Validar que ambos campos tengan valor
        if (!form.fechaInicio || !form.fechaFin) {
            Swal.fire("Error", "Debes ingresar la fecha y hora de inicio y fin.", "error");
            return;
        }

        // Convertir a objeto Date y validar que no sean "Invalid Date"
        const inicio = new Date(form.fechaInicio);
        const fin = new Date(form.fechaFin);
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            Swal.fire("Error", "Fechas inválidas. Por favor selecciona correctamente las fechas y horas.", "error");
            return;
        }

        // Validar lógica de fechas
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
            setTalleres(p => [...p, nuevo]);
            Swal.fire("¡Creado!", "Taller agregado.", "success");
            clearForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Editar taller
    const handleEditSubmit = async e => {
        e.preventDefault();

        // Validar que ambos campos tengan valor
        if (!form.fechaInicio || !form.fechaFin) {
            Swal.fire("Error", "Debes ingresar la fecha y hora de inicio y fin.", "error");
            return;
        }

        // Convertir a objeto Date y validar que no sean "Invalid Date"
        const inicio = new Date(form.fechaInicio);
        const fin = new Date(form.fechaFin);
        if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
            Swal.fire("Error", "Fechas inválidas. Por favor selecciona correctamente las fechas y horas.", "error");
            return;
        }

        // Validar lógica de fechas
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
            setTalleres(p =>
                p.map(t => t.id === actualizado.id ? actualizado : t)
            );
            Swal.fire("¡Actualizado!", "Taller modificado.", "success");
            clearEditForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Eliminar taller
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
        if (confirm.isConfirmed) {
            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE"
                });
                if (!res.ok) throw new Error(await res.text());
                setTalleres(p => p.filter(t => t.id !== id));
                Swal.fire("¡Eliminado!", "Taller borrado.", "success");
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    // Preparar datos cuando se va a editar
    const onEdit = taller => {
        setEditForm({ ...taller });
        setShowEditForm(true);
    };

    // Filtrado y paginación
    const talleresFiltrados = talleres.filter(t =>
        t.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );
    const indexUltimo = paginaActual * talleresPorPagina;
    const indexPrimero = indexUltimo - talleresPorPagina;
    const talleresPagina = talleresFiltrados.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(talleresFiltrados.length / talleresPorPagina);

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
            <table style={{ width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff" }}>
                <thead>
                    <tr style={{ background: "#20232b" }}>
                        <th style={{ padding: 12, width: 120, textAlign: "left" }}>Título</th>
                        <th style={{ padding: 12, width: 200, textAlign: "left" }}>Descripción</th>
                        <th style={{ padding: 12, width: 145, textAlign: "center" }}>Fecha inicio</th>
                        <th style={{ padding: 12, width: 145, textAlign: "center" }}>Fecha fin</th>
                        <th style={{ padding: 12, width: 200, textAlign: "left" }}>Lugar</th>
                        <th style={{ padding: 12, width: 70, textAlign: "center" }}>Cupo</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Precio</th>
                        <th style={{ padding: 12, width: 70, textAlign: "center" }}>Activo</th>
                        <th style={{ padding: 12, width: 90, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {talleresPagina.length === 0 ? (
                        <tr>
                            <td colSpan={9} style={{ textAlign: "center", padding: 20 }}>No hay talleres</td>
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
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                    {t.fechaInicio && new Date(t.fechaInicio).toLocaleString()}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                    {t.fechaFin && new Date(t.fechaFin).toLocaleString()}
                                </td>
                                <td style={{ padding: 10, textAlign: "left", verticalAlign: "middle" }}>{t.lugar}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>{t.cupoMaximo}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    {Number(t.precio).toLocaleString("es-CR", { style: "currency", currency: "CRC", minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>{t.activo ? "Sí" : "No"}</td>
                                <td style={{ padding: 10, textAlign: "center", verticalAlign: "middle" }}>
                                    <button
                                        onClick={() => onEdit(t)}
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
                                        title="Editar taller"
                                    >
                                        <i className="fas fa-edit"></i>
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
                                            cursor: "pointer"
                                        }}
                                        title="Eliminar taller"
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
