// src/components/TallerDetallePage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function TallerDetallePage() {
  const { id } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [taller, setTaller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inscrito, setInscrito] = useState(false);
  const [cupoLleno, setCupoLleno] = useState(false);

  const usuarioId = user.id; // Reemplaza con el ID del usuario autenticado
  console.log(user.id)

  useEffect(() => {
    // Cargar datos del taller
    fetch(`http://localhost:8080/api/talleres/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar el taller");
        return res.json();
      })
      .then((data) => {
        setTaller(data);
        setCupoLleno(data.inscripciones.length >= data.cupoMaximo);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // Verificar si el usuario ya está inscrito
    fetch(`http://localhost:8080/api/inscripciones/usuario/${usuarioId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al verificar inscripción");
        return res.json();
      })
      .then((inscripciones) => {
        const yaInscrito = inscripciones.some((i) => i.taller.id === parseInt(id));
        setInscrito(yaInscrito);
      })
      .catch(() => setInscrito(false));
  }, [id]);

  const handleInscripcion = async () => {
    console.log(usuarioId)
    try {
      const inscripcion = {
        estado: "PENDIENTE",
        fechaInscripcion: new Date().toISOString(),
        taller: { id: taller.id },
        usuario: { id: usuarioId },
      };

      const res = await fetch("http://localhost:8080/api/inscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inscripcion),
      });

      if (!res.ok) throw new Error("No se pudo realizar la inscripción");

      alert("✅ Inscripción exitosa");
      navigate("/talleres");
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando taller...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;

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
      <p><strong>Fecha:</strong> {new Date(taller.fechaInicio).toLocaleString()} - {new Date(taller.fechaFin).toLocaleString()}</p>
      <p><strong>Lugar:</strong> {taller.lugar}</p>
      <p><strong>Cupo máximo:</strong> {taller.cupoMaximo}</p>
      <p><strong>Precio:</strong> {taller.precio.toLocaleString("es-CR", { style: "currency", currency: "CRC" })}</p>

      {inscrito ? (
        <p style={{ color: "#8FDE58", marginTop: 20 }}>✅ Ya estás inscrito en este taller.</p>
      ) : cupoLleno ? (
        <p style={{ color: "#f44336", marginTop: 20 }}>❌ Este taller ya no tiene cupo disponible.</p>
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
