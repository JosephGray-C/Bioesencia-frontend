import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { fetchTaller } from "../services/talleres";
import {
    fetchInscripcionTaller,
    crearInscripcion,
} from "../services/inscripciones";
import { useUser } from "../context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";
import { formatoFechaHoraAmPm, formatoHoraAmPm } from "../utils/formatDateTime";

const WINE = "var(--biosencia-wine, #5A0D0D)";
const GREEN = "var(--biosencia-green, #A9C499)";
const TEXT = "#1f2937";
const BORDER = "#e5e7eb";

export default function TallerModal({ tallerSelected, onClose }) {
    const { user } = useUser();
    const qc = useQueryClient();

    const {
        data: taller,
        isFetching: isFetchingTaller,
        error: errorTaller,
    } = useQuery({
        queryKey: ["taller", tallerSelected.id],
        queryFn: fetchTaller,
        enabled: !!tallerSelected.id,
        initialData: () =>
            qc.getQueryData(["taller", tallerSelected.id]) || null,
        onError: (err) => {
            Swal.fire({
                icon: err?.code === 404 ? "warning" : "error",
                title: err?.code === 404 ? "Taller no encontrado" : "Error",
                text: err?.message || "No se pudieron cargar los datos.",
                confirmButtonColor: WINE,
            });
        },
    });

    const { data: inscripciones = [], isFetching: isFetchingIns } = useQuery({
        queryKey: ["inscripcionesTaller", tallerSelected.id],
        queryFn: fetchInscripcionTaller,
        enabled: !!tallerSelected.id,
        initialData: () =>
            qc.getQueryData(["inscripcionesTaller", tallerSelected.id]) || [],
    });

    const showSpinner = (isFetchingTaller || isFetchingIns) && !taller;

    const inscritosCount = inscripciones.length;
    const cupoMax = Number(taller?.cupoMaximo ?? 0);
    const cupoLleno = cupoMax > 0 ? inscritosCount >= cupoMax : false;
    const inscrito = user.id
        ? inscripciones.some((i) => Number(i?.usuarioId) === user.id)
        : false;

    const [inscribiendo, setInscribiendo] = useState(false);

    const handleInscripcion = async () => {
        if (!user.id) {
            Swal.fire({
                icon: "info",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para inscribirte.",
                confirmButtonColor: WINE,
            });
            return;
        }
        if (!taller?.id) return;

        const confirm = await Swal.fire({
            title: "Confirmar inscripción",
            text: `¿Deseas inscribirte en "${taller.titulo}"?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, inscribirme",
            cancelButtonText: "Cancelar",
            confirmButtonColor: GREEN,
            cancelButtonColor: "#7A7670",
        });
        if (!confirm.isConfirmed) return;

        try {
            setInscribiendo(true);
            const resCheck = await fetchInscripcionTaller({
                queryKey: ["inscripcionesTaller", taller.id],
            });
            let listaIns = resCheck.ok ? await resCheck.json() : [];
            if (!Array.isArray(listaIns)) listaIns = listaIns ? [listaIns] : [];

            if (listaIns.some((i) => Number(i?.usuarioId) === user.id)) {
                Swal.fire({
                    icon: "info",
                    title: "Ya estás inscrito",
                    text: "Tu inscripción ya se encuentra registrada.",
                    confirmButtonColor: WINE,
                });
                return;
            }

            if (cupoMax > 0 && listaIns.length >= cupoMax) {
                Swal.fire({
                    icon: "warning",
                    title: "Cupo lleno",
                    text: "Este taller ya no tiene cupo disponible.",
                    confirmButtonColor: WINE,
                });
                return;
            }

            const body = {
                usuario: { id: user.id },
                taller: { id: Number(taller.id) },
            };

            const res = await crearInscripcion(body);

            if (!res.ok) throw new Error("No se pudo realizar la inscripción");

            await Swal.fire({
                icon: "success",
                title: "¡Inscripción exitosa!",
                text: "Te has inscrito correctamente.",
                confirmButtonColor: GREEN,
            });

            if (onClose) onClose();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error en la inscripción",
                text: err.message || "Inténtalo de nuevo más tarde.",
                confirmButtonColor: WINE,
            });
        } finally {
            setInscribiendo(false);
        }
    };

    if (showSpinner) {
        return (
            <div
                style={{
                    minHeight: 260,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: TEXT,
                    background: "#fff",
                }}
            >
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <ClipLoader size={24} color={GREEN} speedMultiplier={0.9} />
                    <span>Cargando taller…</span>
                </span>
            </div>
        );
    }

    if (errorTaller || !taller) {
        return <p style={{ padding: 20 }}>No se encontró el taller.</p>;
    }

    return (
        <div className="taller-modal-card" style={modalCardStyles}>
            <button
                className="modal-close"
                style={modalCloseStyles}
                onClick={onClose}
                title="Cerrar"
            >
                ×
            </button>
            <div style={{ textAlign: "center", marginBottom: 14 }}>
                <h2
                    style={{
                        margin: 0,
                        color: WINE,
                        fontSize: "clamp(20px, 2.4vw, 26px)",
                        letterSpacing: ".2px",
                    }}
                >
                    {taller.titulo}
                </h2>
                <div
                    style={{
                        width: 84,
                        height: 4,
                        background: GREEN,
                        borderRadius: 999,
                        margin: "10px auto 0",
                    }}
                />
            </div>
            {taller.descripcion && (
                <p
                    style={{
                        marginTop: 8,
                        marginBottom: 14,
                        color: "#4b5563",
                        lineHeight: 1.6,
                        textAlign: "center",
                    }}
                >
                    {taller.descripcion}
                </p>
            )}
            <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                <p style={{ margin: 0 }}>
                    <strong style={{ color: WINE }}>Fecha: </strong>
                    {taller.fechaInicio
                        ? formatoFechaHoraAmPm(taller.fechaInicio)
                        : "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong style={{ color: WINE }}>Hora inicio: </strong>
                    {taller.fechaInicio
                        ? formatoHoraAmPm(taller.fechaInicio)
                        : "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong style={{ color: WINE }}>Hora fin: </strong>
                    {taller.fechaFin ? formatoHoraAmPm(taller.fechaFin) : "—"}
                </p>
                <p style={{ margin: 0 }}>
                    <strong style={{ color: WINE }}>Lugar: </strong>
                    {taller.lugar || "—"}
                </p>
            </div>
            <div
                style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    margin: "8px 0 14px",
                    justifyContent: "center",
                }}
            >
                <span
                    style={{
                        background: "#f3f4f6",
                        color: TEXT,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontWeight: 700,
                        fontSize: ".875rem",
                    }}
                >
                    Cupo máx: {cupoMax || "—"}
                </span>
                <span
                    style={{
                        background: "#f3f4f6",
                        color: TEXT,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontWeight: 700,
                        fontSize: ".875rem",
                    }}
                >
                    Inscritos: {inscritosCount}
                </span>
                <span
                    style={{
                        background: "rgba(169,196,153,.25)",
                        color: WINE,
                        border: `1px solid ${GREEN}`,
                        borderRadius: 999,
                        padding: "6px 10px",
                        fontWeight: 700,
                        fontSize: ".875rem",
                    }}
                >
                    Disponibles: {cupoMax > 0 ? cupoMax - inscritosCount : 0}
                </span>
            </div>
            {cupoLleno && (
                <div
                    style={{
                        margin: "10px 0 14px",
                        padding: "10px 12px",
                        background: "#fff5f5",
                        color: WINE,
                        border: `1px solid ${WINE}`,
                        borderRadius: 10,
                        fontWeight: 700,
                        textAlign: "center",
                    }}
                >
                    ❌ Este taller ya no tiene cupo disponible.
                </div>
            )}
            {inscrito && (
                <div
                    style={{
                        margin: "10px 0 14px",
                        padding: "10px 12px",
                        background: "rgba(169,196,153,.25)",
                        color: WINE,
                        border: `1px solid ${GREEN}`,
                        borderRadius: 10,
                        fontWeight: 700,
                        textAlign: "center",
                    }}
                >
                    Ya estás inscrito en este taller.
                </div>
            )}
            {!cupoLleno && !inscrito && (
                <div style={{ textAlign: "center" }}>
                    <button
                        onClick={handleInscripcion}
                        disabled={inscribiendo}
                        style={{
                            marginTop: 8,
                            padding: "12px 28px",
                            backgroundColor: GREEN,
                            color: WINE,
                            border: "none",
                            borderRadius: 12,
                            cursor: inscribiendo ? "not-allowed" : "pointer",
                            fontWeight: 800,
                            fontSize: "1rem",
                            opacity: inscribiendo ? 0.85 : 1,
                            transition:
                                "transform .15s, filter .15s, box-shadow .15s",
                        }}
                        title={inscribiendo ? "Procesando…" : "Inscribirme"}
                    >
                        {inscribiendo ? "Procesando…" : "Inscribirme"}
                    </button>
                </div>
            )}
        </div>
    );
}

const modalCardStyles = {
    maxWidth: 480,
    width: "100%",
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderRadius: 24,
    boxShadow: "0 16px 40px rgba(0,0,0,.18)",
    color: TEXT,
    textAlign: "left",
    padding: "24px 22px 26px",
    position: "relative",
    margin: "0 auto",
};

const modalCloseStyles = {
    position: "absolute",
    top: 18,
    right: 28,
    background: "none",
    border: "none",
    fontSize: "2.2rem",
    color: WINE,
    cursor: "pointer",
    zIndex: 2,
    transition: "color .15s",
};
