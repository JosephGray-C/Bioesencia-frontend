// src/components/AdminOrdenes.jsx
import React, {useEffect, useState} from "react";
import Swal from "sweetalert2";

const API_ORDENES = "http://localhost:8080/api/ordenes";
const ESTADOS_POSIBLES = ["PENDIENTE", "PAGADO", "ANULADO"];

function EditarOrdenModal({editForm, onChange, onSubmit, onCancel}) {
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
            <div className="container"
                 style={{maxWidth: 520, width: "100%", position: "relative", boxShadow: "0 8px 32px #0004"}}>
                <div className="forms" style={{background: "#fff"}}>
                    <div className="form-content">
                        <div className="signup-form" style={{width: "100%"}}>
                            <div className="title"
                                 style={{fontWeight: 600, fontSize: 26, marginBottom: 12, color: "#5EA743"}}>
                                Editar orden
                            </div>
                            <form onSubmit={onSubmit}>
                                <div className="input-boxes" style={{marginTop: 18}}>
                                    <div className="input-box">
                                        <i className="fas fa-hashtag"></i>
                                        <input type="text" name="codigoOrden" value={editForm.codigoOrden} readOnly/>
                                    </div>

                                    <div className="input-box" style={{display: "flex", alignItems: "center", gap: 12}}>
                                        <label style={{minWidth: 90, color: "#5A0D0D"}}>
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
                                                fontSize: 16
                                            }}
                                        >
                                            {ESTADOS_POSIBLES.map(op => (
                                                <option key={op} value={op}>{op}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="button input-box" style={{marginTop: 26}}>
                                        <input type="submit" value="Guardar cambios"/>
                                    </div>
                                    <div style={{marginTop: 8, textAlign: "right"}}>
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={{
                                                background: "#6c757d", color: "#fff",
                                                border: "none", borderRadius: 6,
                                                padding: "8px 18px", fontWeight: 500,
                                                fontSize: "1rem", cursor: "pointer"
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
                        position: "absolute", top: 12, right: 18, fontSize: 26,
                        background: "none", border: "none", cursor: "pointer", color: "#888"
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
    const [ordenes, setOrdenes] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const porPagina = 8;

    const [showEdit, setShowEdit] = useState(false);
    const [editForm, setEditForm] = useState({
        id: "",
        codigoOrden: "",
        estado: "PENDIENTE"
    });

    const cargarTodas = async () => {
        try {
            const res = await fetch(API_ORDENES);
            const data = await res.json();
            setOrdenes(Array.isArray(data) ? data : []);
            setPaginaActual(1);
        } catch (e) {
            Swal.fire("Error", "No se pudieron cargar las órdenes", "error");
        }
    };

    useEffect(() => {
        cargarTodas();
    }, []);

    const handleBuscar = async () => {
        const codigo = busqueda.trim();
        if (!codigo) {
            await cargarTodas();
            return;
        }
        try {
            const res = await fetch(`${API_ORDENES}/codigo/${encodeURIComponent(codigo)}`);
            if (res.ok) {
                const unica = await res.json();
                setOrdenes([unica]);
                setPaginaActual(1);
            } else {
                Swal.fire("Sin resultados", "No existe una orden con ese código", "info");
            }
        } catch (e) {
            Swal.fire("Error", "No se pudo buscar la orden", "error");
        }
    };

    const onEdit = (ord) => {
        setEditForm({
            id: ord.id,
            codigoOrden: ord.codigoOrden,
            estado: ord.estado
        });
        setShowEdit(true);
    };

    const onEditChange = (e) => {
        const {name, value} = e.target;
        setEditForm(f => ({...f, [name]: value}));
    };

    const onEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${API_ORDENES}/${editForm.id}/estado?estado=${encodeURIComponent(editForm.estado)}`;
            const res = await fetch(url, {method: "PUT"});
            if (!res.ok) throw new Error(await res.text());
            const actualizada = await res.json();

            setOrdenes(prev => prev.map(o => (o.id === actualizada.id ? actualizada : o)));
            setShowEdit(false);
            Swal.fire("¡Actualizada!", "Estado de la orden actualizado.", "success");
        } catch (err) {
            Swal.fire("Error", err.message || "No se pudo actualizar el estado", "error");
        }
    };

    // Paginación básica (sobre las órdenes cargadas/buscadas)
    const indexUltimo = paginaActual * porPagina;
    const indexPrimero = indexUltimo - porPagina;
    const pagina = ordenes.slice(indexPrimero, indexUltimo);
    const totalPaginas = Math.ceil(ordenes.length / porPagina);

    const fmtCRC = (n) =>
        Number(n || 0).toLocaleString("es-CR", {style: "currency", currency: "CRC", minimumFractionDigits: 2});

    const fmtFecha = (f) => {
        if (!f) return "";
        // LocalDateTime serializado → "2025-08-05T19:11:00"
        const d = new Date(f);
        return isNaN(d.getTime()) ? f : d.toLocaleString("es-CR", {hour12: false});
    };

    return (
        <div className="home-crud">
            {/* HEADER acciones */}
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 14, gap: 18, width: "100%"
            }}>
                {/* Buscar por código */}
                <div style={{flex: 1, display: "flex", alignItems: "center", gap: 8}}>
                    <input
                        type="text"
                        placeholder="Buscar código de orden (BO-XXXXXXX)"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleBuscar()}
                        style={{
                            padding: "10px 14px",
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            fontSize: 16,
                            width: "100%",
                            maxWidth: 360
                        }}
                    />
                    <button
                        onClick={handleBuscar}
                        style={{
                            background: "#5EA743", color: "#fff",
                            fontWeight: 700, border: "none", borderRadius: 8,
                            padding: "10px 18px", fontSize: 16, cursor: "pointer"
                        }}
                    >
                        Buscar
                    </button>
                    <button
                        onClick={cargarTodas}
                        style={{
                            background: "#6c757d", color: "#fff",
                            fontWeight: 600, border: "none", borderRadius: 8,
                            padding: "10px 14px", fontSize: 16, cursor: "pointer"
                        }}
                        title="Recargar todas"
                    >
                        Ver todas
                    </button>
                </div>
            </div>

            {/* TABLA */}
            <table style={{width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff"}}>
                <thead>
                <tr style={{background: "#20232b"}}>
                    <th style={{padding: 12, textAlign: "left"}}>Código</th>
                    <th style={{padding: 12, textAlign: "left"}}>Cliente</th>
                    <th style={{padding: 12, textAlign: "left"}}>Fecha</th>
                    <th style={{padding: 12, textAlign: "right"}}>Total</th>
                    <th style={{padding: 12, textAlign: "center"}}>Estado</th>
                    <th style={{padding: 12, textAlign: "center"}}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {pagina.length === 0 ? (
                    <tr>
                        <td colSpan={6} style={{textAlign: "center", padding: 20}}>Sin órdenes</td>
                    </tr>
                ) : (
                    pagina.map(ord => (
                        <tr key={ord.id} style={{borderBottom: "1px solid #222"}}>
                            <td style={{padding: 10}}>{ord.codigoOrden}</td>
                            <td style={{ padding: 10 }}>
                                {ord.usuarioNombre || ord.usuarioApellido
                                    ? `${ord.usuarioNombre ?? ""} ${ord.usuarioApellido ?? ""}`.trim()
                                    : (ord.usuario?.nombre
                                        ? `${ord.usuario?.nombre ?? ""} ${ord.usuario?.apellido ?? ""}`.trim()
                                        : (ord.usuarioEmail || "—"))}
                            </td>
                            <td style={{padding: 10}}>{fmtFecha(ord.fechaOrden)}</td>
                            <td style={{padding: 10, textAlign: "right"}}>{fmtCRC(ord.total)}</td>
                            <td style={{padding: 10, textAlign: "center"}}>{ord.estado}</td>
                            <td style={{padding: 10, textAlign: "center"}}>
                                <button
                                    onClick={() => onEdit(ord)}
                                    style={{
                                        marginRight: 8, background: "#fff", color: "#FF9800",
                                        border: "none", borderRadius: 5, padding: "6px 10px",
                                        fontSize: 16, cursor: "pointer"
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
            <div style={{width: "100%", marginTop: 20}}>
        <span style={{color: "#ccc", display: "block", marginBottom: 8, textAlign: "center"}}>
          Mostrando {pagina.length} de {ordenes.length}
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
