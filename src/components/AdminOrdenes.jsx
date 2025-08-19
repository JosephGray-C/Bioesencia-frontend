// src/components/AdminOrdenes.jsx
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ClipLoader from "react-spinners/ClipLoader";

const API_ORDENES = "http://localhost:8080/api/ordenes";
const ESTADOS_POSIBLES = ["PENDIENTE", "PAGADO", "ANULADO"];

async function fetchOrdenes({ signal }) {
    const res = await fetch(API_ORDENES, { signal });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}

async function actualizarEstadoOrden({ id, estado }) {
    const url = `${API_ORDENES}/${id}/estado?estado=${encodeURIComponent(
        estado
    )}`;
    const res = await fetch(url, { method: "PUT" });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

/* Modal editar */
function EditarOrdenModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
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
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: 520,
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
                                Editar orden
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{ marginTop: 18 }}>
                                    <div className="input-box">
                                        <i className="fas fa-hashtag"></i>
                                        <input
                                            type="text"
                                            name="codigoOrden"
                                            value={editForm.codigoOrden}
                                            readOnly
                                        />
                                    </div>

                                    <div
                                        className="input-box"
                                        style={{ display: "flex", alignItems: "center", gap: 12 }}
                                    >
                                        <label style={{ minWidth: 90, color: "#5A0D0D" }}>
                                            <strong>Estado:</strong>
                                        </label>
                                        <select
                                            name="estado"
                                            value={editForm.estado}
                                            onChange={onChange}
                                            style={{
                                                flex: 1,
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #ccc",
                                                fontSize: 16,
                                            }}
                                        >
                                            {ESTADOS_POSIBLES.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </select>
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

                {/* Botón cerrar */}
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

export default function AdminOrdenes() {
    const qc = useQueryClient();

    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const porPagina = 8;

    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        codigoOrden: "",
        estado: "PENDIENTE",
    });

    // Usa React Query con caché y spinner
    const { data: ordenes = [], isFetching, refetch } = useQuery({
        queryKey: ["ordenes"],
        queryFn: fetchOrdenes,
        initialData: () => qc.getQueryData(["ordenes"]) || [],
    });

    // MUTATION para actualizar estado
    const mEstado = useMutation({
        mutationFn: actualizarEstadoOrden,
        onSuccess: () => {
            Swal.fire("¡Guardado!", "El estado de la orden fue actualizado.", "success");
            setShowEdit(false);
            refetch();
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "No se pudo actualizar el estado.", "error");
        },
    });

    // Filtrado en tiempo real por todos los campos relevantes
    const ordenesFiltradas = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return ordenes;
        return ordenes.filter((ord) =>
            (ord.codigoOrden || "").toLowerCase().includes(q) ||
            (ord.usuarioNombre || "").toLowerCase().includes(q) ||
            (ord.usuarioApellido || "").toLowerCase().includes(q) ||
            (ord.usuarioEmail || ord.usuarioCorreo || "").toLowerCase().includes(q) ||
            (ord.estado || "").toLowerCase().includes(q) ||
            (ord.total?.toString() || "").toLowerCase().includes(q) ||
            (ord.fechaOrden || "").toLowerCase().includes(q)
        );
    }, [ordenes, busqueda]);

    const totalPaginas = Math.ceil(ordenesFiltradas.length / porPagina) || 1;
    const pag = Math.min(paginaActual, totalPaginas);
    const start = (pag - 1) * porPagina;
    const pagina = ordenesFiltradas.slice(start, start + porPagina);

    const fmtCRC = (n) =>
        Number(n || 0).toLocaleString("es-CR", {
            style: "currency",
            currency: "CRC",
            minimumFractionDigits: 2,
        });

    const fmtFecha = (f) => {
        if (!f) return "";
        const d = new Date(f);
        return isNaN(d.getTime())
            ? f
            : d.toLocaleString("es-CR", { hour12: false });
    };

    const onEdit = (ord) => {
        setEditForm({
            id: ord.id,
            codigoOrden: ord.codigoOrden,
            estado: ord.estado,
        });
        setShowEdit(true);
    };

    const onEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((f) => ({ ...f, [name]: value }));
    };

    const onEditSubmit = (e) => {
        e.preventDefault();
        mEstado.mutate({ id: editForm.id, estado: editForm.estado });
    };

    // Spinner visible solo si está cargando y no hay datos
    const showSpinner = isFetching && ordenes.length === 0;

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
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                        type="text"
                        placeholder="Buscar por órden"
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
                        <th style={{ padding: 12, textAlign: "left" }}>Código</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Cliente</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Fecha</th>
                        <th style={{ padding: 12, textAlign: "right" }}>Total</th>
                        <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
                        <th style={{ padding: 12, textAlign: "center" }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagina.length === 0 ? (
                        <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: 32 }}>
                                {showSpinner ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <ClipLoader size={22} color="#A9C499" speedMultiplier={0.9} />
                                        <span style={{ color: "#5A0D0D" }}>Cargando órdenes…</span>
                                    </span>
                                ) : (
                                    "Sin órdenes"
                                )}
                            </td>
                        </tr>
                    ) : (
                        pagina.map((ord) => (
                            <tr key={ord.id} style={{ borderBottom: "1px solid #222" }}>
                                <td style={{ padding: 10 }}>{ord.codigoOrden}</td>
                                <td style={{ padding: 10 }}>
                                    {ord.usuarioNombre || ord.usuarioApellido
                                        ? `${ord.usuarioNombre ?? ""} ${ord.usuarioApellido ?? ""}`.trim()
                                        : ord.usuario?.nombre
                                            ? `${ord.usuario?.nombre ?? ""} ${ord.usuario?.apellido ?? ""}`.trim()
                                            : ord.usuarioEmail || "—"}
                                </td>
                                <td style={{ padding: 10 }}>{fmtFecha(ord.fechaOrden)}</td>
                                <td style={{ padding: 10, textAlign: "right" }}>
                                    {fmtCRC(ord.total)}
                                </td>
                                <td style={{ padding: 10, textAlign: "center" }}>
                                    {ord.estado}
                                </td>
                                <td style={{ padding: 10, textAlign: "center" }}>
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
                    Mostrando {pagina.length} de {ordenesFiltradas.length}
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

            {/* MODAL EDITAR */}
            {showEdit && (
                <EditarOrdenModal
                    editForm={editForm}
                    onChange={onEditChange}
                    onSubmit={onEditSubmit}
                    onCancel={() => setShowEdit(false)}
                />
            )}
        </div>
    );
}