// src/components/TallerDetallePage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";

export default function TallerDetallePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [taller, setTaller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inscrito, setInscrito] = useState(false);
  const [cupoLleno, setCupoLleno] = useState(false);

  // Último segmento de la URL: /talleres/1 -> "1"
  const tallerId = window.location.pathname.replace(/\/+$/, "").split("/").pop();
  const usuarioId = user?.id ? Number(user.id) : null;

  useEffect(() => {
    if (!tallerId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);

        const [resTaller, resInscripciones] = await Promise.all([
          fetch(`http://localhost:8080/api/talleres/${tallerId}`, { signal: controller.signal }),
          fetch(`http://localhost:8080/api/inscripciones/taller/${tallerId}`, { signal: controller.signal }),
        ]);

        if (resTaller.status === 404) {
          Swal.fire({
            icon: "warning",
            title: "Taller no encontrado",
            text: "El taller no existe o fue eliminado.",
            confirmButtonColor: "#5A0D0D",
          }).then(() => navigate("/talleres"));
          return;
        }

        if (!resTaller.ok) {
          throw new Error("Error al cargar el taller");
        }

        const dataTaller = await resTaller.json();
        const listaIns = resInscripciones.ok ? await resInscripciones.json() : [];

        setTaller(dataTaller);

        // Cupo
        const cantidad = Array.isArray(listaIns) ? listaIns.length : 0;
        setCupoLleno(Number(cantidad) >= Number(dataTaller.cupoMaximo ?? Infinity));

        // ¿Usuario ya inscrito en este taller?
        const yaInscrito = usuarioId
          ? listaIns.some((i) => Number(i?.usuario?.id) === usuarioId)
          : false;
        setInscrito(yaInscrito);
      } catch (e) {
        if (e.name !== "AbortError") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: e.message || "No se pudieron cargar los datos.",
            confirmButtonColor: "#5A0D0D",
          });
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [tallerId, usuarioId, navigate]);

  const handleInscripcion = async () => {
    // Requisitos previos
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

    // Confirmación
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
      // Revalidar cupo y duplicados inmediatamente antes de enviar
      const resCheck = await fetch(`http://localhost:8080/api/inscripciones/taller/${taller.id}`);
      const listaIns = resCheck.ok ? await resCheck.json() : [];

      if (listaIns.some((i) => Number(i?.usuario?.id) === usuarioId)) {
        setInscrito(true);
        Swal.fire({
          icon: "info",
          title: "Ya estás inscrito",
          text: "Tu inscripción ya se encuentra registrada.",
          confirmButtonColor: "#5A0D0D",
        });
        return;
      }

      if (listaIns.length >= (taller.cupoMaximo ?? 0)) {
        setCupoLleno(true);
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

      const res = await fetch("http://localhost:8080/api/inscripciones", {
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
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando taller...</p>;
  if (!taller)  return null;

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
      <p><strong>Descripción:</strong> {taller.descripcion}</p>
      <p>
        <strong>Fecha:</strong>{" "}
        {new Date(taller.fechaInicio).toLocaleString()} -{" "}
        {new Date(taller.fechaFin).toLocaleString()}
      </p>
      <p><strong>Lugar:</strong> {taller.lugar}</p>
      <p><strong>Cupo máximo:</strong> {taller.cupoMaximo}</p>
      <p>
        <strong>Precio:</strong>{" "}
        {typeof taller.precio === "number"
          ? taller.precio.toLocaleString("es-CR", { style: "currency", currency: "CRC" })
          : "—"}
      </p>

      {inscrito ? (
        <p style={{ color: "#8FDE58", marginTop: 20 }}>
          ✅ Ya estás inscrito en este taller.
        </p>
      ) : cupoLleno ? (
        <p style={{ color: "#f44336", marginTop: 20 }}>
          ❌ Este taller ya no tiene cupo disponible.
        </p>
      ) : (
        <button
          onClick={handleInscripcion}
          style={{
            marginTop: 30,
            padding: "12px 28px",
            backgroundColor: "#8FDE58",
            color: "#1c1c1c",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Inscribirme
        </button>
      )}
    </div>
  );
}
