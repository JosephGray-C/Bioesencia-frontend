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

    // Derive selected horario from cita.fechaHora
    const horarioSeleccionado = cita.fechaHora
        ? cita.fechaHora.split("T")[1]
        : "";

    return (
        <div>
            <style>{styles}</style>
            <h3>Horarios</h3>
            <div className="horarios-list">
                {horarios.map((hora) => (
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

const styles = `
    .horarios-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        align-items: center;
        margin-top: 18px;
        width: 100%;
    }
    .horario-card {
        background: #f6f7f8;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,.07);
        padding: 16px 28px;
        width: 100%;
        min-width: 0;
        max-width: 100%;
        text-align: center;
        font-size: 1.08rem;
        color: #23272f;
        font-weight: 600;
        margin: 0;
        transition: box-shadow .15s;
        box-sizing: border-box;
        cursor: pointer;
    }
    .horario-card:hover {
        box-shadow: 0 6px 18px rgba(0,0,0,.13);
    }
    .horario-card.selected {
        border: 2px solid #A9C499;
        background: #e6f7e6;
    }
`;
