// src/components/AdminCitas.jsx
import { useState } from "react";
import { fetchServicios } from "../services/servicios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import {
    fetchCitas,
    crearCita,
    actualizarCita,
    eliminarCita,
} from "../services/citas";
import usePaginacion from "../hooks/usePaginacion";
import useFiltrarCitas from "../hooks/useFiltrarCitas";
import AdminCrearCitaModal from "./AdminCrearCitaModal";
import AdminEditarCitaModal from "./AdminEditarCitaModal";

export default function AdminCitas() {
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

    // queries
    const qc = useQueryClient();
    const { data: citas = [], isFetching } = useQuery({
        queryKey: ["citas"],
        queryFn: fetchCitas,
        initialData: () => qc.getQueryData(["citas"]) || [],
    });
    const { data: serviciosDisponibles = [] } = useQuery({
        queryKey: ["servicios"],
        queryFn: fetchServicios,
        initialData: () => qc.getQueryData(["servicios"]) || [],
    });

    // spinner
    const showSpinner = isFetching && citas.length === 0;

    // crear
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
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

    // editar
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
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...editForm };
        delete payload.usuario;
        mEditar.mutate({ id: editForm.id, payload });
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

    // eliminar
    const mEliminar = useMutation({
        mutationFn: eliminarCita,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["citas"] });
            Swal.fire("¡Eliminada!", "Cita borrada.", "success");
        },
        onError: (e) => {
            console.log(e);
            Swal.fire("Error", e.message || "No se pudo eliminar", "error");
        },
    });
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

    // Filtrado
    const { listaFiltrada, busqueda, setBusqueda } = useFiltrarCitas(citas);
    // Paginación
    const { pagina, totalPaginas, paginaActual, setPaginaActual } =
        usePaginacion(listaFiltrada);

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
                <AdminCrearCitaModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                    serviciosDisponibles={serviciosDisponibles}
                />
            )}
            {showEditForm && (
                <AdminEditarCitaModal
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
                    background: "#fff",
                    borderCollapse: "collapse",
                    color: "#000000",
                }}
            >
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Fecha y hora
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Servicio
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Usuario
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Correo
                        </th>
                        <th style={{ padding: 12, textAlign: "center" }}>
                            Estado
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Notas
                        </th>
                        <th style={{ padding: 12, textAlign: "center" }}>
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pagina.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                style={{ textAlign: "center", padding: 20 }}
                            >
                                {showSpinner ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ClipLoader
                                            size={18}
                                            color="#bbb"
                                            speedMultiplier={0.9}
                                        />
                                    </span>
                                ) : (
                                    "No hay citas"
                                )}
                            </td>
                        </tr>
                    ) : (
                        pagina.map((c) => (
                            <tr
                                key={c.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
                                <td
                                    style={{
                                        padding: 10,
                                        textAlign: "left",
                                        verticalAlign: "middle",
                                    }}
                                >
                                    {c.fechaHora
                                        ?.replace("T", " ")
                                        .slice(0, 16)}
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
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                    }}
                >
                    Mostrando {pagina.length} de {listaFiltrada.length}
                </span>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                    }}
                >
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setPaginaActual(i + 1)}
                            style={{
                                margin: "0 2px",
                                padding: "6px 12px",
                                borderRadius: 6,
                                background:
                                    paginaActual === i + 1 ? "#5EA743" : "#444",
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
