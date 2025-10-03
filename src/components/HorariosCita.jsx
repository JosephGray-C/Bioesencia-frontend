import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dateFormat, formatTimeAmPm } from "../utils/formatDateTime.js";
import { horariosDisponibles } from "../services/citas.js";
import Loading from "./Loading.jsx";

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
    if (showSpinner)
        return <Loading message="Cargando horarios" />;
    if (horarios.length === 0)
        return <p>No hay horarios disponibles para esta fecha.</p>;

    // Filtrar horarios si es sábado (solo 09:00 a 15:00)
    let horaActual = new Date().getHours();
    let horariosFiltrados = horarios;

    console.log(`selectedDate: ${selectedDate.toDateString()}`);
    console.log(`Fecha actual: ${new Date().toDateString()}`);
    console.log(`Hora actual: ${horaActual} : ${new Date().getMinutes()}`);
    console.log(`Día de la semana: ${selectedDate.getDay()}`);

    if (selectedDate.toDateString() === new Date().toDateString()) {
        horariosFiltrados = horarios.filter((hora) => {
            const [h] = hora.split(":").map(Number);
            return h > horaActual;
        });
    }
    if (selectedDate.getDay() === 6) {
        horariosFiltrados = horarios.filter((hora) => {
            const [h] = hora.split(":").map(Number);
            return h >= 9 && h < 16;
        });
    }

    console.log(horariosFiltrados);
    if (horariosFiltrados.length === 0)
        return <p>No hay horarios disponibles para esta fecha.</p>;

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
