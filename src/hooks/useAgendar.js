import { useState } from "react";
import { useUser } from "../context/UserContext";

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
                setMensaje(`Cita solicitada para el ${selectedDate.toLocaleDateString()} a las ${selectedHora}`);
                const res = await fetch(`http://localhost:8080/api/citas/horariosDisponibles?fecha=${fechaStr}`);
                const nuevosHorarios = await res.json();
                setHorariosDisponibles(nuevosHorarios);
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
        mensaje
    };
}
