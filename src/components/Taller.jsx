import { formatoFechaHoraAmPm, formatoHoraAmPm } from "../utils/formatDateTime";

export default function Taller({ taller, setSelectedTaller }) {
    return (
        <div>
            <style>{styles}</style>
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

const styles = `
    .tp-grid {
    list-style: none;
    margin: 0 auto;
    padding: 0;
    display: grid;
    gap: 32px;
    max-width: 900px;
    grid-template-columns: repeat(2, 1fr);
    justify-items: center;
    align-items: stretch;
}
@media (max-width: 700px){
    .tp-grid {
        grid-template-columns: 1fr;
        gap: 16px;
        padding: 0 2vw;
    }
}
@media (min-width: 1100px){
  .tp-grid{
    max-width: 1100px;
    gap: 28px;
  }
}

.tp-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 8px 22px rgba(0,0,0,.07);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
    max-width: 400px;
    width: 100%;
    transition: transform .16s, box-shadow .16s;
    cursor: pointer;
}
.tp-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(0,0,0,.10);
}
.tp-card-inner {
  padding: 18px 18px 12px 18px;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.tp-card-title {
  margin: 0 0 6px;
  color: #5A0D0D;
  font-size: clamp(18px,2vw,22px);
  font-weight: 800;
}
.tp-card-desc {
  margin: 0 0 8px 0;
  color: #23272f;
  font-size: 15px;
  line-height: 1.45;
}
.tp-card-info {
    font-size: 1rem;
    color: #41503a;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
`;
