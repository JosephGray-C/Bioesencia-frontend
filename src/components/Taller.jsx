import { formatoFechaHoraAmPm, formatoHoraAmPm } from "../utils/formatDateTime";

export default function Taller({ taller, setSelectedTaller }) {
    return (
        <article
            key={taller.id}
            className="bu-card tp-card"
            tabIndex={0}
            onClick={() => setSelectedTaller(taller)}
            style={{ cursor: "pointer" }}
        >
            {/* Imagen */}
            {taller.imagenUrl ? (
                <div className="bu-card-media">
                    <img
                        src={taller.imagenUrl}
                        alt={taller.titulo || "Imagen del taller"}
                        loading="lazy"
                    />
                </div>
            ) : (
                <div className="bu-card-media bu-card-media--placeholder">
                    <span>Taller</span>
                </div>
            )}

            {/* Contenido */}
            <div className="bu-card-body">
                <h3 className="bu-card-title">{taller.titulo}</h3>
                {taller.descripcion && (
                    <p className="bu-card-excerpt">{taller.descripcion}</p>
                )}
            </div>

            {/* Footer */}
            <div
                className="bu-card-footer"
                style={{
                    justifyContent: "space-between",
                    minHeight: "48px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <div
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <span style={{ fontSize: 14 }}>
                        <strong>Lugar:</strong> {taller.lugar}
                    </span>
                    <span style={{ fontSize: 14 }}>
                        <strong>Fecha y hora:</strong>{" "}
                        {taller.fechaInicio
                            ? `${formatoFechaHoraAmPm(taller.fechaInicio)}`
                            : "—"}
                        {taller.fechaFin
                            ? ` - ${formatoHoraAmPm(taller.fechaFin)}`
                            : ""}
                    </span>
                </div>
                <span
                    style={{ fontWeight: 700, color: "#5a0d0d", fontSize: 16 }}
                >
                    {Number(taller.precio || 0).toLocaleString("es-CR", {
                        style: "currency",
                        currency: "CRC",
                    })}
                </span>
            </div>
        </article>
    );
}