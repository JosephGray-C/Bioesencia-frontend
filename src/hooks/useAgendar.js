import { useUser } from "../context/UserContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatTimeAmPm, formatDateTimeLocal } from "../utils/formatDateTime.js";
import { crearCita } from "../services/citas.js";
import Swal from "sweetalert2";

export function useAgendar() {
    const { user } = useUser();
    const qc = useQueryClient();

    const mCrearCita = useMutation({
        mutationFn: crearCita,
        onSuccess: () => {
            qc.invalidateQueries(["citas", user?.id]);
            
        },
        onError: (error) => {
            Swal.fire("Error", error.message || "No se pudo crear la cita", "error");
        }
    });

    const agendarCita = async ({ selectedHora, selectedDate, notas, servicio, setProcesando, setHorariosDisponibles }) => {
        setProcesando && setProcesando(true);
        const cita = {
            fechaHora: formatDateTimeLocal(selectedDate, selectedHora),
            duracion: 60,
            servicio,
            estado: "AGENDADA",
            notas: notas || "",
            usuario: user,
        };
        try {
            const response = await mCrearCita.mutateAsync(cita);

            setHorariosDisponibles &&
                setHorariosDisponibles((horarios) =>
                    horarios.filter((hora) => hora !== selectedHora)
                );
            Swal.fire(
                "¡Creado!",
                `Cita reservada para el ${selectedDate.toLocaleDateString()} a las ${formatTimeAmPm(selectedHora)}`,
                "success"
            );
        } catch (error) {
            console.error("Error al crear cita:", error);
        }
        setProcesando && setProcesando(false);

        
        
        // return response;
    };

    return {
        agendarCita
    };
}