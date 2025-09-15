import React from "react";
import { formatoFechaHoraAmPm } from "../utils/formatDateTime";

export default function ConfirmarCita({ cita }) {
    return (
        <div className="confirmar-cita-container">
            <h3>Confirmar Cita</h3>
            <p>
                <strong>Servicio:</strong> {cita.servicio || "No seleccionado"}
            </p>
            <p>
                <strong>Fecha y Hora:</strong>{" "}
                {formatoFechaHoraAmPm(cita.fechaHora) === "—"
                    ? "No seleccionada"
                    : formatoFechaHoraAmPm(cita.fechaHora)}
            </p>
            <p>
                <strong>Notas:</strong> {cita.notas || "Sin notas"}
            </p>
        </div>
    );
}