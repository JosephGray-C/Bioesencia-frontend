import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_TALLER = "http://localhost:8080/api/talleres";
const API_INS_TALLER = "http://localhost:8080/api/inscripciones/taller";
const API_INS = "http://localhost:8080/api/inscripciones";

const WINE = "var(--biosencia-wine, #5A0D0D)";
const GREEN = "var(--biosencia-green, #A9C499)";
const TEXT = "#1f2937";
const BORDER = "#e5e7eb";

// ------------------ Data fetching ------------------
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
          confirmButtonColor: WINE,
        }).then(() => navigate("/talleres"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.message || "No se pudieron cargar los datos.",
          confirmButtonColor: WINE,
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
      const resCheck = await fetch(`${API_INS_TALLER}/${taller.id}`);
      let listaIns = resCheck.ok ? await resCheck.json() : [];
      if (!Array.isArray(listaIns)) listaIns = listaIns ? [listaIns] : [];

      if (listaIns.some((i) => Number(i?.usuarioId) === usuarioId)) {
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

      const body = { usuario: { id: usuarioId }, taller: { id: Number(taller.id) } };

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
        confirmButtonColor: GREEN,
      });

      navigate("/talleres");
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

  // Formato solo hora AM/PM
  function formatoHoraAmPm(fechaStr) {
    if (!fechaStr) return "—";
    const fecha = new Date(fechaStr);
    let horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    const ampm = horas >= 12 ? "PM" : "AM";
    horas = horas % 12 || 12;
    return `${horas}:${minutos} ${ampm}`;
  }

  function formatoFecha(fechaStr) {
    if (!fechaStr) return "—";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString();
  }

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
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <ClipLoader size={24} color={GREEN} speedMultiplier={0.9} />
          <span>Cargando taller…</span>
        </span>
      </div>
    );
  }

  if (errorTaller || !taller) {
    return <p style={{ padding: 20 }}>No se encontró el taller.</p>;
  }

  const disponibles = cupoMax > 0 ? Math.max(0, cupoMax - inscritosCount) : 0;

  return (
    <div style={{ background: "#fff", padding: "32px 16px" }}>
      {/* estilos locales para hover/animaciones */}
      <style>{styles}</style>
      <div
        className="card"
        style={{
          maxWidth: 760,
          margin: "0 auto",
          background: "#ffffff",
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,.06)",
          color: TEXT,
          textAlign: "left",
          padding: "24px 22px 26px",
        }}
      >
        {/* Título */}
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

        {/* Descripción */}
        {taller.descripcion && (
          <p style={{ marginTop: 8, marginBottom: 14, color: "#4b5563", lineHeight: 1.6 }}>
            {taller.descripcion}
          </p>
        )}

        {/* Detalles */}
        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: WINE }}>Fecha: </strong>
            {taller.fechaInicio ? formatoFecha(taller.fechaInicio) : "—"}
          </p>
          <p style={{ margin: 0 }}>
            <strong style={{ color: WINE }}>Hora inicio: </strong>
            {taller.fechaInicio ? formatoHoraAmPm(taller.fechaInicio) : "—"}
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

        {/* Stats como chips */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 14px" }}>
          <span className="badge" style={{ background: "#f3f4f6", color: TEXT, border: `1px solid ${BORDER}` }}>
            Cupo máx: {cupoMax || "—"}
          </span>
          <span className="badge" style={{ background: "#f3f4f6", color: TEXT, border: `1px solid ${BORDER}` }}>
            Inscritos: {inscritosCount}
          </span>
          <span
            className="badge"
            style={{
              background: "rgba(169,196,153,.25)",
              color: WINE,
              border: `1px solid ${GREEN}`,
            }}
          >
            Disponibles: {disponibles}
          </span>
        </div>

        {/* Mensajes de estado */}
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

        {/* Botón Inscripción */}
        {!cupoLleno && !inscrito && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleInscripcion}
              disabled={inscribiendo}
              className="btn"
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
              }}
              title={inscribiendo ? "Procesando…" : "Inscribirme"}
            >
              {inscribiendo ? "Procesando…" : "Inscribirme"}
            </button>
          </div>
        )}

        {/* Botón Volver */}
        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            className="volver-btn tp-btn"
            style={{
              display: "inline-block",
              width: "100%",
              marginTop: 18,
              padding: "10px 16px",
              background: "#A9C499",
              color: "#5A0D0D",
              border: "none",
              borderRadius: 8,
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              textAlign: "center",
              transition: "transform .15s, box-shadow .15s, filter .15s",
            }}
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = `
  .card { transition: box-shadow .2s ease, transform .2s ease; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.08); }
  .btn { transition: transform .15s ease, filter .15s ease, box-shadow .15s ease; }
  .btn:hover { filter: brightness(.96); transform: translateY(-1px); box-shadow: 0 6px 18px rgba(0,0,0,.10); }
  .badge { border-radius: 999px; padding: 6px 10px; font-weight: 700; font-size: .875rem; }
  .tp-btn {
    display: inline-block;
    width: 100%;
    margin-top: 10px;
    padding: 10px 16px;
    background: #A9C499;
    color: #5A0D0D;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 800;
    text-align: center;
    border: none;
    transition: transform .15s, filter .15s;
    font-size: 1rem;
    cursor: pointer;
  }
  .tp-btn:hover {
    filter: brightness(.96);
    transform: translateY(-1px);
  }
`;
