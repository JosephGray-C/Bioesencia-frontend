import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTalleres } from "../services/talleres";
import { formatoFechaHoraAmPm, formatoHoraAmPm } from "../utils/formatDateTime";

export default function Talleres() {
    const qc = useQueryClient();

    const {
        data: talleres = [],
        isFetching,
        error,
    } = useQuery({
        queryKey: ["talleres"],
        queryFn: fetchTalleres,
        initialData: () => qc.getQueryData(["talleres"]) || [],
    });

    const showSpinner = isFetching && talleres.length === 0;

    if (error) {
        return (
            <div className="tp-error">
                ⚠️ No se pudieron cargar los talleres.
            </div>
        );
    }

    return (
        <div className="tp">
            <style>{styles}</style>
            <header className="tp-hero">
                <div className="tp-hero-inner">
                    <p className="tp-subtitle">
                        Descubre y participa en los talleres de{" "}
                        <strong>Bioesencia</strong> para tu bienestar.
                    </p>
                </div>
            </header>
            {talleres.length === 0 ? (
                <div className="tp-empty">
                    {showSpinner ? (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <ClipLoader
                                size={22}
                                color="var(--green)"
                                speedMultiplier={0.9}
                            />
                            <span>Cargando talleres…</span>
                        </span>
                    ) : (
                        <p>No hay talleres disponibles en este momento.</p>
                    )}
                </div>
            ) : (
                <ul className="tp-grid">
                    {talleres.map((taller) => (
                        <li key={taller.id} className="tp-card">
                            <div className="tp-card-inner">
                                <h3 className="tp-card-title">
                                    {taller.titulo}
                                </h3>
                                {taller.descripcion && (
                                    <p className="tp-card-desc">
                                        {taller.descripcion}
                                    </p>
                                )}
                                <div className="tp-card-info">
                                    <span>
                                        <strong>Fecha y hora:</strong>{" "}
                                        {taller.fechaInicio
                                            ? `${formatoFechaHoraAmPm(
                                                  taller.fechaInicio
                                              )}`
                                            : "—"}
                                        {taller.fechaFin
                                            ? ` - ${formatoHoraAmPm(
                                                  taller.fechaFin
                                              )}`
                                            : ""}
                                    </span>
                                    <span>
                                        <strong>Lugar:</strong> {taller.lugar}
                                    </span>
                                    <span>
                                        <strong>Precio:</strong>{" "}
                                        {Number(
                                            taller.precio || 0
                                        ).toLocaleString("es-CR", {
                                            style: "currency",
                                            currency: "CRC",
                                        })}
                                    </span>
                                </div>
                                <Link
                                    to={`/talleres/${taller.id}`}
                                    className="tp-btn"
                                >
                                    Ver más
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

const styles = `
:root{
  --wine:#5A0D0D;
  --green:#A9C499;
  --border:#e5e7eb;
  --text:#1f2937;
}

.tp {
  min-height: 100vh;
  background: #fff;
  padding: 24px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
@media (min-width:640px){.tp{padding:32px 20px;}}
@media (min-width:1024px){.tp{padding:40px 24px;}}

.tp-hero {
  width: 100%;
  max-width: 900px;
  margin: 0 auto 18px auto;
  text-align: left;
  padding: 18px 0 10px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.tp-hero-inner {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  width: 100%;
}
.tp-title {
  margin: 0 0 8px 0;
  color: var(--wine);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: .2px;
}
.tp-subtitle {
  margin: 0;
  color: #41503a;
  font-size: clamp(14px, 2vw, 17px);
}

.tp-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wine);
}
.tp-error {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  background: #fff0f0;
  color: var(--wine);
  border: 2px solid var(--wine);
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
}

.tp-grid {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  display: grid;
  gap: 22px;
  max-width: 900px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
  align-items: stretch;
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
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 15px;
  color: #41503a;
}
.tp-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 16px;
  background: #A9C499;
  color: #5A0D0D;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 800;
  text-align: center;
  transition: transform .15s, filter .15s;
  align-self: flex-end;
}
.tp-btn:hover {
  filter: brightness(.96);
  transform: translateY(-1px);
}
@media (max-width:480px){ .tp-btn{display:block;width:100%;} }
`;
