// src/components/AdminOrdenes.jsx
import { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";
import { fetchOrdenes, actualizarEstadoOrden } from "../services/ordenes";
import usePaginacion from "../hooks/usePaginacion";
import useFiltrarOrdenes from "../hooks/useFiltrarOrdenes";
import AdminEditarOrdenModal from "./AdminEditarOrdenModal";
import { fmtFecha, fmtCRC } from "../utils/formatDateTime";

export default function AdminOrdenes() {
    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        codigoOrden: "",
        estado: "PENDIENTE",
    });

    // queries
    const qc = useQueryClient();
    const {
        data: ordenes = [],
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["ordenes"],
        queryFn: fetchOrdenes,
        initialData: () => qc.getQueryData(["ordenes"]) || [],
    });

    // spinner
    const showSpinner = isFetching && ordenes.length === 0;

    // editar
    const mEditar = useMutation({
        mutationFn: actualizarEstadoOrden,
        onSuccess: () => {
            Swal.fire(
                "¡Guardado!",
                "El estado de la orden fue actualizado.",
                "success"
            );
            setShowEdit(false);
            refetch();
        },
        onError: (err) => {
            Swal.fire(
                "Error",
                err.message || "No se pudo actualizar el estado.",
                "error"
            );
        },
    });
    const handleEditSubmit = (e) => {
        e.preventDefault();
        mEditar.mutate({ id: editForm.id, estado: editForm.estado });
    };
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };
    const onEdit = (ord) => {
        setEditForm({
            id: ord.id,
            codigoOrden: ord.codigoOrden,
            estado: ord.estado,
        });
        setShowEdit(true);
    };

    // Filtrado
    const { listaFiltrada, busqueda, setBusqueda } = useFiltrarOrdenes(ordenes);
    // Paginación
    const { pagina, totalPaginas, paginaActual, setPaginaActual } =
        usePaginacion(listaFiltrada);
        
    return (
        <div className="home-crud">
            {/* HEADER acciones */}
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
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Buscar por órden"
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
                            maxWidth: 360,
                        }}
                    />
                </div>
            </div>

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
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Código
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Cliente
                        </th>
                        <th style={{ padding: 12, textAlign: "left" }}>
                            Fecha
                        </th>
                        <th style={{ padding: 12, textAlign: "right" }}>
                            Total
                        </th>
                        <th style={{ padding: 12, textAlign: "center" }}>
                            Estado
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
                                colSpan={6}
                                style={{ textAlign: "center", padding: 32 }}
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
                                            size={22}
                                            color="#A9C499"
                                            speedMultiplier={0.9}
                                        />
                                        <span style={{ color: "#5A0D0D" }}>
                                            Cargando órdenes…
                                        </span>
                                    </span>
                                ) : (
                                    "Sin órdenes"
                                )}
                            </td>
                        </tr>
                    ) : (
                        pagina.map((ord) => (
                            <tr
                                key={ord.id}
                                style={{ borderBottom: "1px solid #222" }}
                            >
                                <td style={{ padding: 10 }}>
                                    {ord.codigoOrden}
                                </td>
                                <td style={{ padding: 10 }}>
                                    {ord.usuarioNombre || ord.usuarioApellido
                                        ? `${ord.usuarioNombre ?? ""} ${
                                              ord.usuarioApellido ?? ""
                                          }`.trim()
                                        : ord.usuario?.nombre
                                        ? `${ord.usuario?.nombre ?? ""} ${
                                              ord.usuario?.apellido ?? ""
                                          }`.trim()
                                        : ord.usuarioEmail || "—"}
                                </td>
                                <td style={{ padding: 10 }}>
                                    {fmtFecha(ord.fechaOrden)}
                                </td>
                                <td style={{ padding: 10, textAlign: "right" }}>
                                    {fmtCRC(ord.total)}
                                </td>
                                <td
                                    style={{ padding: 10, textAlign: "center" }}
                                >
                                    {ord.estado}
                                </td>
                                <td
                                    style={{ padding: 10, textAlign: "center" }}
                                >
                                    <button
                                        onClick={() => onEdit(ord)}
                                        style={{
                                            marginRight: 8,
                                            background: "#fff",
                                            color: "#FF9800",
                                            border: "none",
                                            borderRadius: 5,
                                            padding: "6px 10px",
                                            fontSize: 16,
                                            cursor: "pointer",
                                        }}
                                        title="Editar estado"
                                    >
                                        <i className="fas fa-edit"></i>
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

            {/* MODAL EDITAR */}
            {showEdit && (
                <AdminEditarOrdenModal
                    editForm={editForm}
                    onChange={handleEditChange}
                    onSubmit={handleEditSubmit}
                    onCancel={() => setShowEdit(false)}
                />
            )}
        </div>
    );
}
