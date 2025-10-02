import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dateFormat, formatTimeAmPm } from "../utils/formatDateTime.js";
import { horariosDisponibles } from "../services/citas.js";

export default function HorariosList({ selectedDate, cita, setCita }) {
    const qc = useQueryClient();

    const {
        data: horarios = [],
        isFetching,
        error,
    } = useQuery({
        queryKey: ["horarios", selectedDate],
        queryFn: () => horariosDisponibles(dateFormat(selectedDate)),
        initialData: () => qc.getQueryData(["horarios", selectedDate]) || [],
        enabled: !!selectedDate,
    });
    const showSpinner = isFetching && horarios.length === 0;

    if (error) return <p>Error al cargar los horarios: {error.message}</p>;
    if (showSpinner) return <p>Cargando horarios...</p>;
    if (horarios.length === 0)
        return <p>No hay horarios disponibles para esta fecha.</p>;

    // Filtrar horarios si es sábado (solo 09:00 a 15:00)
    let horariosFiltrados = horarios;
    if (selectedDate && new Date(selectedDate).getDay() === 6) {
        horariosFiltrados = horarios.filter((hora) => {
            const [h, m] = hora.split(":").map(Number);
            return (h >= 9 && h < 15) || (h === 15 && m === 0);
        });
    }

    // Derive selected horario from cita.fechaHora
    const horarioSeleccionado = cita.fechaHora
        ? cita.fechaHora.split("T")[1]
        : "";

    return (
        <div>
            <h3>Horarios</h3>
            <div className="horarios-list">
                {horariosFiltrados.map((hora) => (
                    <div
                        className={`horario-card${
                            horarioSeleccionado === hora ? " selected" : ""
                        }`}
                        key={hora}
                        onClick={() =>
                            setCita((prev) => ({
                                ...prev,
                                fechaHora:
                                    dateFormat(selectedDate) + "T" + hora,
                            }))
                        }
                    >
                        {formatTimeAmPm(hora)}
                    </div>
                ))}
            </div>
        </div>
    );
}
