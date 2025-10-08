// src/components/AdminServicios.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import {
    fetchServicios,
    crearServicio,
    actualizarServicio,
    eliminarServicio,
} from "../services/servicios";
import usePaginacion from "../hooks/usePaginacion";
import useFiltrarServicios from "../hooks/useFiltrarServicios";
import AdminCrearServicioModal from "./AdminCrearServicioModal";
import AdminEditarServicioModal from "./AdminEditarServicioModal";

export default function AdminServicios() {
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
    
    // queries
    const qc = useQueryClient();
    const { data: servicios = [], isFetching } = useQuery({
        queryKey: ["servicios"],
        queryFn: fetchServicios,
        initialData: () => qc.getQueryData(["servicios"]) || [],
    });

    // spinner 
    const showSpinner = isFetching && servicios.length === 0;
    
    // crear
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
    const handleSubmit = (e) => {
        e.preventDefault();
        mCrear.mutate({
            ...form,
            precio: Number(form.precio),
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };
    const clearForm = () => {
        setForm({ nombre: "", detalle: "", precio: "" });
        setShowForm(false);
    };

    // editar
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
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };
    const onEdit = (servicio) => {
        setEditForm({ ...servicio, precio: servicio.precio ?? "" });
        setShowEditForm(true);
    };
    const clearEditForm = () => {
        setEditForm({ id: "", nombre: "", detalle: "", precio: "" });
        setShowEditForm(false);
    };

    // eliminar
    const mEliminar = useMutation({
        mutationFn: eliminarServicio,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["servicios"] });
            Swal.fire("¡Eliminado!", "Servicio borrado.", "success");
        },
        onError: (e) =>
            Swal.fire("Error", e.message || "No se pudo eliminar", "error"),
    });
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

    // Filtro de búsqueda
    const { listaFiltrada, busqueda, setBusqueda } = useFiltrarServicios(servicios);
    // Paginación
    const { pagina,totalPaginas, paginaActual, setPaginaActual } = usePaginacion(listaFiltrada);
    
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
                <AdminCrearServicioModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onCancel={clearForm}
                />
            )}
            {showEditForm && (
                <AdminEditarServicioModal
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
                        <th
                            style={{
                                padding: 12,
                                width: 110,
                                textAlign: "left",
                            }}
                        >
                            Nombre
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 110,
                                textAlign: "left",
                            }}
                        >
                            Detalle
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 110,
                                textAlign: "center",
                            }}
                        >
                            Precio
                        </th>
                        <th
                            style={{
                                padding: 12,
                                width: 110,
                                textAlign: "center",
                            }}
                        >
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pagina.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
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
                                    "No hay servicios"
                                )}
                            </td>
                        </tr>
                    ) : (
                        pagina.map((s) => (
                            <tr
                                key={s.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
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
