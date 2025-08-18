import { useState } from "react";
import { useUser } from "../context/UserContext";

function formatoHoraAmPm(hora24) {
    if (!hora24) return "";
    const [h, m] = hora24.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hora12 = h % 12 === 0 ? 12 : h % 12;
    return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function useAgendar() {
    const { user } = useUser();
    const [mensaje, setMensaje] = useState("");

    const solicitarCita = async ({ selectedHora, selectedDate, notas, servicio, setHorariosDisponibles, setProcesando, onSuccess }) => {
        const fechaStr = selectedDate.toISOString().split("T")[0];
        const fechaHora = `${fechaStr}T${selectedHora}`;
        
        const cita = {
            fechaHora,
            duracion: 60,
            servicio,
            estado: "AGENDADA",
            notas: notas || "",
            usuario: user,
        };
        
        try {
            setProcesando && setProcesando(true);
            const response = await fetch("http://localhost:8080/api/citas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cita),
            });
            
            if (response.ok) {
                setMensaje(`Cita solicitada para el ${selectedDate.toLocaleDateString()} a las ${formatoHoraAmPm(selectedHora)}`);
                // Fetch horarios actualizados desde el backend
                const resHorarios = await fetch(`http://localhost:8080/api/horarios?fecha=${fechaStr}`);
                if (resHorarios.ok) {
                    const nuevosHorarios = await resHorarios.json();
                    setHorariosDisponibles(nuevosHorarios);
                }
                if (typeof onSuccess === "function") onSuccess();
            } else {
                setMensaje("Error al solicitar la cita.");
            }
        } finally {
            setProcesando && setProcesando(false);
        }
    };

    return {
        solicitarCita,
        mensaje,
    };
}