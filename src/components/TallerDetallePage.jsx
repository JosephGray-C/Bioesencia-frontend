// src/components/TallerDetallePage.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_TALLER = "http://localhost:8080/api/talleres";
const API_INS_TALLER = "http://localhost:8080/api/inscripciones/taller";
const API_INS = "http://localhost:8080/api/inscripciones";

async function fetchTaller({ queryKey, signal }) {
    const [, id] = queryKey;
    const res = await fetch(`${API_TALLER}/${id}`, { signal });
    if (res.status === 404) {
        const err = new Error("NOT_FOUND");
        err.code = 404;
        throw err;
    }
    if (!res.ok) throw new Error("Error al cargar el taller");
    return res.json();
}

async function fetchInscripcionesTaller({ queryKey, signal }) {
    const [, id] = queryKey;
    const res = await fetch(`${API_INS_TALLER}/${id}`, { signal });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data ? [data] : [];
}

export default function TallerDetallePage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const qc = useQueryClient();

    const tallerId = routeId || window.location.pathname.replace(/\/+$/, "").split("/").pop();
    const usuarioId = user?.id ? Number(user.id) : null;

    const {
        data: taller,
        isFetching: isFetchingTaller,
        error: errorTaller,
    } = useQuery({
        queryKey: ["taller", tallerId],
        queryFn: fetchTaller,
        enabled: !!tallerId,
        initialData: () => qc.getQueryData(["taller", tallerId]) || null,
        onError: (err) => {
            if (err?.code === 404 || err?.message === "NOT_FOUND") {
                Swal.fire({
                    icon: "warning",
                    title: "Taller no encontrado",
                    text: "El taller no existe o fue eliminado.",
                    confirmButtonColor: "#5A0D0D",
                }).then(() => navigate("/talleres"));
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err?.message || "No se pudieron cargar los datos.",
                    confirmButtonColor: "#5A0D0D",
                });
            }
        },
    });

    const {
        data: inscripciones = [],
        isFetching: isFetchingIns,
    } = useQuery({
        queryKey: ["inscripcionesTaller", tallerId],
        queryFn: fetchInscripcionesTaller,
        enabled: !!tallerId,
        initialData: () => qc.getQueryData(["inscripcionesTaller", tallerId]) || [],
    });

    const showSpinner = (isFetchingTaller || isFetchingIns) && !taller;

    const inscritosCount = inscripciones.length;
    const cupoMax = Number(taller?.cupoMaximo ?? 0);
    const cupoLleno = cupoMax > 0 ? inscritosCount >= cupoMax : false;
    const inscrito = usuarioId
        ? inscripciones.some((i) => Number(i?.usuarioId) === usuarioId)
        : false;

    const [inscribiendo, setInscribiendo] = useState(false);

    const handleInscripcion = async () => {
        if (!usuarioId) {
            Swal.fire({
                icon: "info",
                title: "Inicia sesión",
                text: "Debes iniciar sesión para inscribirte.",
                confirmButtonColor: "#5A0D0D",
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
            confirmButtonColor: "#8FDE58",
            cancelButtonColor: "#7A7670",
        });
        if (!confirm.isConfirmed) return;

        try {
            setInscribiendo(true);
            const resCheck = await fetch(`${API_INS_TALLER}/${taller.id}`);
            let listaIns = resCheck.ok ? await resCheck.json() : [];
            if (!Array.isArray(listaIns)) listaIns = listaIns ? [listaIns] : [];

            if (listaIns.some((i) => Number(i?.usuarioId) === usuarioId)) {
                Swal.fire({
                    icon: "info",
                    title: "Ya estás inscrito",
                    text: "Tu inscripción ya se encuentra registrada.",
                    confirmButtonColor: "#5A0D0D",
                });
                return;
            }

            if (cupoMax > 0 && listaIns.length >= cupoMax) {
                Swal.fire({
                    icon: "warning",
                    title: "Cupo lleno",
                    text: "Este taller ya no tiene cupo disponible.",
                    confirmButtonColor: "#5A0D0D",
                });
                return;
            }

            const body = {
                usuario: { id: usuarioId },
                taller: { id: Number(taller.id) },
            };

            const res = await fetch(API_INS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error("No se pudo realizar la inscripción");

            await Swal.fire({
                icon: "success",
                title: "¡Inscripción exitosa!",
                text: "Te has inscrito correctamente.",
                confirmButtonColor: "#8FDE58",
            });

            navigate("/talleres");
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error en la inscripción",
                text: err.message || "Inténtalo de nuevo más tarde.",
                confirmButtonColor: "#5A0D0D",
            });
        } finally {
            setInscribiendo(false);
        }
    };

    if (showSpinner) {
        return (
            <div
                style={{
                    padding: 40,
                    minHeight: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#bbb",
                }}
            >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                    <ClipLoader size={24} color="#bbb" speedMultiplier={0.9} />
                    <span>Cargando taller…</span>
                </span>
            </div>
        );
    }

    if (errorTaller || !taller) {
        return <p style={{ padding: 20 }}>No se encontró el taller.</p>;
    }

    const disponibles =
        cupoMax > 0 ? Math.max(0, cupoMax - inscritosCount) : 0;

    return (
        <div
            style={{
                padding: 40,
                maxWidth: 800,
                margin: "0 auto",
                backgroundColor: "#2c2c2c",
                borderRadius: 12,
                color: "#f0f0f0",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                textAlign: "center",
            }}
        >
            <h2 style={{ color: "#8FDE58" }}>{taller.titulo}</h2>
            <p>
                <strong>Descripción:</strong> {taller.descripcion}
            </p>
            <p>
                <strong>Fecha:</strong>{" "}
                {taller.fechaInicio ? new Date(taller.fechaInicio).toLocaleString() : "—"}{" "}
                -{" "}
                {taller.fechaFin ? new Date(taller.fechaFin).toLocaleString() : "—"}
            </p>
            <p>
                <strong>Lugar:</strong> {taller.lugar}
            </p>
            <p>
                <strong>Cupo máximo:</strong> {cupoMax || "—"}
            </p>
            <p>
                <strong>Inscritos:</strong> {inscritosCount}
            </p>
            <p>
                <strong>Cupos disponibles:</strong> {disponibles}
            </p>

            {cupoLleno && (
                <div style={{ color: "red", fontWeight: "bold", margin: "1rem 0" }}>
                    ❌ Este taller ya no tiene cupo disponible.
                </div>
            )}
            {inscrito && (
                <div style={{ color: "#8FDE58", fontWeight: "bold", margin: "1rem 0" }}>
                    Ya estás inscrito en este taller.
                </div>
            )}

            {/* Botón de inscripción solo si hay cupo y no está inscrito */}
            {!cupoLleno && !inscrito && (
                <button
                    onClick={handleInscripcion}
                    disabled={inscribiendo}
                    style={{
                        marginTop: 30,
                        padding: "12px 28px",
                        backgroundColor: "#8FDE58",
                        color: "#1c1c1c",
                        border: "none",
                        borderRadius: 10,
                        cursor: inscribiendo ? "not-allowed" : "pointer",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        opacity: inscribiendo ? 0.85 : 1,
                    }}
                    title={inscribiendo ? "Procesando…" : "Inscribirme"}
                >
                    {inscribiendo ? "Procesando…" : "Inscribirme"}
                </button>
            )}
        </div>
    );
}