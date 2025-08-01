import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";

const API_URL = "http://localhost:8080/api/citas";
const USERS_URL = "http://localhost:8080/api/usuarios?rol=CLIENTE";

// --- Modal Crear Cita ---
function CrearCitaModal({form, onChange, onSubmit, onCancel, usuarios}) {
    // Opciones de estado
    const estadosCita = [
        "AGENDADA",
        "PENDIENTE",
        "CONFIRMADA",
        "CANCELADA",
        "COMPLETADA"
    ];

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
                <div className="forms" style={{background: "#fff"}}>
                    <div className="form-content">
                        <div className="signup-form" style={{width: "100%"}}>
                            <div className="title" style={{fontWeight: 600, fontSize: 26, marginBottom: 12}}>
                                Agregar cita
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{marginTop: 18}}>
                                    {/* Dropdown de usuario */}
                                    <div className="input-box">
                                        <select
                                            name="usuarioId"
                                            value={form.usuarioId}
                                            onChange={onChange}
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                borderRadius: 6,
                                                background: "#f2f2f2"
                                            }}
                                        >
                                            <option value="">Seleccionar usuario</option>
                                            {usuarios.map(u => (
                                                <option key={u.id} value={u.id}>
                                                    {u.email}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
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
                                        <input
                                            type="text"
                                            name="servicio"
                                            placeholder="Servicio"
                                            value={form.servicio}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="estado">Estado:</label>
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={form.estado}
                                            onChange={onChange}
                                            required
                                            style={{width: "100%", padding: "8px", borderRadius: 6}}
                                        >
                                            <option value="">Seleccionar estado</option>
                                            {estadosCita.map(e => (
                                                <option key={e} value={e}>{e}</option>
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
                                            style={{resize: "vertical", width: "100%"}}
                                        />
                                    </div>
                                    <div className="button input-box" style={{marginTop: 26}}>
                                        <input
                                            type="submit"
                                            value="Guardar cita"
                                        />
                                    </div>
                                    <div style={{marginTop: 8, textAlign: "right"}}>
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

// --- Modal Editar Cita ---
function EditarCitaModal({editForm, onChange, onSubmit, onCancel, usuarioEmail}) {
    const estadosCita = [
        "AGENDADA",
        "CANCELADA",
        "COMPLETADA",
        // "PENDIENTE",
        // "CONFIRMADA",
    ];

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
                <div className="forms" style={{background: "#fff"}}>
                    <div className="form-content">
                        <div className="signup-form" style={{width: "100%"}}>
                            <div className="title"
                                 style={{fontWeight: 600, fontSize: 26, marginBottom: 12, color: "#5EA743"}}>
                                Editar cita
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{marginTop: 18}}>
                                    <div className="input-box">
                                        <label style={{fontWeight: 500, color: "#333"}}>
                                            Usuario ligado a esta cita:
                                        </label>
                                        <div
                                            style={{
                                                padding: "10px 14px",
                                                background: "#f2f2f2",
                                                color: "#222",
                                                borderRadius: 6,
                                                fontWeight: 600,
                                                marginTop: 4
                                            }}
                                        >
                                            {usuarioEmail || "No asignado"}
                                        </div>
                                    </div>
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
                                        <input
                                            type="text"
                                            name="servicio"
                                            placeholder="Servicio"
                                            value={editForm.servicio}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="estado">Estado:</label>
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={editForm.estado}
                                            onChange={onChange}
                                            required
                                            style={{width: "100%", padding: "8px", borderRadius: 6}}
                                        >
                                            {estadosCita.map(e => (
                                                <option key={e} value={e}>{e}</option>
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
                                            style={{resize: "vertical", width: "100%"}}
                                        />
                                    </div>
                                    <div className="button input-box" style={{marginTop: 26}}>
                                        <input
                                            type="submit"
                                            value="Guardar cambios"
                                        />
                                    </div>
                                    <div style={{marginTop: 8, textAlign: "right"}}>
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

// --- Componente principal ---
export default function AdminCitas() {
    const [citas, setCitas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [busqueda, setBusqueda] = useState("");
    const citasPorPagina = 8;

    // Modals y forms independientes
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // Formulario para crear cita
    const [form, setForm] = useState({
        usuarioId: "",
        fechaHora: "",
        duracion: "",
        servicio: "",
        estado: "",
        notas: ""
    });

    // Formulario para editar cita
    const [editForm, setEditForm] = useState({
        id: "",
        fechaHora: "",
        duracion: "",
        servicio: "",
        estado: "",
        notas: "",
        usuario: null // para evitar null pointer
    });

    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEmail, setUsuarioEmail] = useState("");

    // Cargar citas
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(setCitas);
    }, []);

    // Cargar usuarios CLIENTE
    useEffect(() => {
        fetch(USERS_URL)
            .then(res => res.json())
            .then(setUsuarios)
            .catch(() => setUsuarios([]));
    }, []);

    // Cambios en formulario crear
    const handleChange = e => {
        const {name, value} = e.target;
        setForm(f => ({
            ...f,
            [name]: value
        }));
    };

    // Cambios en formulario editar
    const handleEditChange = e => {
        const {name, value} = e.target;
        setEditForm(f => ({
            ...f,
            [name]: value
        }));
    };

    // Limpiar y cerrar modal crear
    const clearForm = () => {
        setForm({
            usuarioId: "",
            fechaHora: "",
            duracion: "",
            servicio: "",
            estado: "",
            notas: ""
        });
        setShowForm(false);
    };

    // Limpiar y cerrar modal editar
    const clearEditForm = () => {
        setEditForm({
            id: "",
            fechaHora: "",
            duracion: "",
            servicio: "",
            estado: "",
            notas: "",
            usuario: null
        });
        setUsuarioEmail("");
        setShowEditForm(false);
    };

    // Crear cita
    const handleSubmit = async e => {
        e.preventDefault();
        // Validar usuario
        if (!form.usuarioId) {
            Swal.fire("Error", "Debes seleccionar un usuario.", "error");
            return;
        }
        // Construir objeto para el backend
        const payload = {
            ...form,
            usuario: {id: form.usuarioId}
        };
        delete payload.usuarioId;

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(await res.text());
            const nueva = await res.json();
            setCitas(p => [...p, nueva]);
            Swal.fire("¡Creada!", "Cita agregada.", "success");
            clearForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Editar cita
    const handleEditSubmit = async e => {
        e.preventDefault();
        // No editar usuario aquí
        const payload = {...editForm};
        delete payload.usuario; // quitar usuario del payload
        try {
            const res = await fetch(`${API_URL}/${editForm.id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(await res.text());
            const actualizada = await res.json();
            setCitas(p =>
                p.map(c => c.id === actualizada.id ? actualizada : c)
            );
            Swal.fire("¡Actualizada!", "Cita modificada.", "success");
            clearEditForm();
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    // Eliminar cita
    const handleDelete = async id => {
        const confirm = await Swal.fire({
            title: "¿Eliminar cita?",
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
                setCitas(p => p.filter(c => c.id !== id));
                Swal.fire("¡Eliminada!", "Cita borrada.", "success");
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    // Preparar datos cuando se va a editar
    const onEdit = cita => {
        setEditForm({
            id: cita.id,
            fechaHora: cita.fechaHora,
            duracion: cita.duracion,
            servicio: cita.servicio,
            estado: cita.estado,
            notas: cita.notas,
            usuario: cita.usuario || null
        });
        setShowEditForm(true);
    };

    // Cargar correo de usuario al abrir el modal de editar
    useEffect(() => {
        if (showEditForm && editForm.id) {
            fetch(`${API_URL}/${editForm.id}/usuario-email`)
                .then(res => res.ok ? res.json() : Promise.reject("No encontrado"))
                .then(data => setUsuarioEmail(data.email || ""))
                .catch(() => setUsuarioEmail(""));
        }
    }, [showEditForm, editForm.id]);

    // Filtrado y paginación
    const citasFiltradas = citas.filter(c =>
        c.servicio?.toLowerCase().includes(busqueda.toLowerCase())
        || c.estado?.toLowerCase().includes(busqueda.toLowerCase())
        || c.notas?.toLowerCase().includes(busqueda.toLowerCase())
    );
    const indexUltimo = paginaActual * citasPorPagina;
    const indexPrimero = indexUltimo - citasPorPagina;
    const citasPagina = citasFiltradas.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

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
                <div style={{flex: 1, display: "flex", alignItems: "center"}}>
                    <input
                        type="text"
                        placeholder="Buscar cita"
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
                <div style={{display: "flex", gap: 10, flexShrink: 0}}>
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
                    usuarios={usuarios}
                />
            )}
            {showEditForm && (
                <EditarCitaModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={clearEditForm}
                    usuarioEmail={usuarioEmail}
                />
            )}

            {/* DATATABLE */}
            <table style={{width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff"}}>
                <thead>
                <tr style={{background: "#20232b"}}>
                    <th style={{padding: 12, textAlign: "left"}}>Fecha y hora</th>
                    <th style={{padding: 12, textAlign: "left"}}>Servicio</th>
                    <th style={{padding: 12, textAlign: "center"}}>Estado</th>
                    <th style={{padding: 12, textAlign: "left"}}>Notas</th>
                    <th style={{padding: 12, textAlign: "center"}}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {citasPagina.length === 0 ? (
                    <tr>
                        <td colSpan={5} style={{textAlign: "center", padding: 20}}>No hay citas</td>
                    </tr>
                ) : (
                    citasPagina.map(c => (
                        <tr key={c.id} style={{borderBottom: "1px solid #222"}}>
                            <td style={{padding: 10, textAlign: "left", verticalAlign: "middle"}}>
                                {c.fechaHora?.replace("T", " ").slice(0, 16)}
                            </td>
                            <td style={{padding: 10, textAlign: "left", verticalAlign: "middle"}}>{c.servicio}</td>
                            <td style={{padding: 10, textAlign: "center", verticalAlign: "middle"}}>{c.estado}</td>
                            <td style={{
                                padding: 10,
                                textAlign: "left",
                                verticalAlign: "middle",
                                maxWidth: 200,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                            }}
                                title={c.notas}
                            >
                                {c.notas?.length > 90
                                    ? c.notas.slice(0, 90) + "..."
                                    : c.notas}
                            </td>
                            <td style={{padding: 10, textAlign: "center", verticalAlign: "middle"}}>
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
                                        cursor: "pointer"
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
                                        cursor: "pointer"
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
            <div style={{width: "100%", marginTop: 20}}>
                <span style={{color: "#ccc", display: "block", marginBottom: 8, textAlign: "center"}}>
                    Mostrando {citasPagina.length} de {citasFiltradas.length}
                </span>
                <div style={{display: "flex", justifyContent: "center", gap: 4}}>
                    {Array.from({length: totalPaginas}, (_, i) => (
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
