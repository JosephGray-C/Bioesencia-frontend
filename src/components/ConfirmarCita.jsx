import React from "react";
import { formatoFechaHoraAmPm } from "../utils/formatDateTime";

export default function ConfirmarCita({ cita }) {
    return (
        <div className="confirmar-cita-container">
            <style>{styles}</style>
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

const styles = `
.confirmar-cita-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.confirmar-cita-container h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #23272f;
}
.confirmar-cita-container p {
  font-size: 1rem;
  color: #586069;
}
`;
