import { formatoFechaHoraAmPm, formatoHoraAmPm } from "../utils/formatDateTime";

export default function Taller({ taller, setSelectedTaller }) {
    return (
        <div>
            <li key={taller.id} className="tp-card">
                <div
                    className="tp-card-inner"
                    onClick={() => setSelectedTaller(taller)}
                    style={{ cursor: "pointer" }}
                    tabIndex={0}
                >
                    <h3 className="tp-card-title">{taller.titulo}</h3>
                    {taller.descripcion && (
                        <p className="tp-card-desc">{taller.descripcion}</p>
                    )}
                    <div className="tp-card-info">
                        <span>
                            <strong>Fecha y hora:</strong>{" "}
                            {taller.fechaInicio
                                ? `${formatoFechaHoraAmPm(taller.fechaInicio)}`
                                : "—"}
                            {taller.fechaFin
                                ? ` - ${formatoHoraAmPm(taller.fechaFin)}`
                                : ""}
                        </span>
                        <span>
                            <strong>Lugar:</strong> {taller.lugar}
                        </span>
                        <span>
                            <strong>Precio:</strong>{" "}
                            {Number(taller.precio || 0).toLocaleString(
                                "es-CR",
                                {
                                    style: "currency",
                                    currency: "CRC",
                                }
                            )}
                        </span>
                    </div>
                </div>
            </li>
        </div>
    );
}