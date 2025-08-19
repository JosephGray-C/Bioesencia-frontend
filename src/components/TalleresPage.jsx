import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const API_URL = "http://localhost:8080/api/talleres";

async function fetchTalleres({ signal }) {
  const res = await fetch(API_URL, { signal });
  if (!res.ok) throw new Error("Error al cargar los talleres");
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function formatoFechaHoraAmPm(fechaStr) {
  if (!fechaStr) return "—";
  const fecha = new Date(fechaStr);
  const fechaLocal = fecha.toLocaleDateString();
  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12 || 12;
  return `${fechaLocal} ${horas}:${minutos} ${ampm}`;
}

function formatoHoraAmPm(fechaStr) {
  if (!fechaStr) return "—";
  const fecha = new Date(fechaStr);
  let horas = fecha.getHours();
  const minutos = fecha.getMinutes().toString().padStart(2, "0");
  const ampm = horas >= 12 ? "PM" : "AM";
  horas = horas % 12 || 12;
  return `${horas}:${minutos} ${ampm}`;
}

export default function TalleresPage() {
  const qc = useQueryClient();

  const { data: talleres = [], isFetching, error } = useQuery({
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
      {talleres.length === 0 ? (
        <div className="tp-empty">
          {showSpinner ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <ClipLoader size={22} color="var(--green)" speedMultiplier={0.9} />
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
                <h3>{taller.titulo}</h3>
                {taller.descripcion && <p>{taller.descripcion}</p>}
                <p>
                  <strong style={{ color: "#5A0D0D" }}>Fecha y hora: </strong>
                  {taller.fechaInicio
                    ? `${formatoFechaHoraAmPm(taller.fechaInicio)}`
                    : "—"}
                  {taller.fechaFin
                    ? ` - ${formatoHoraAmPm(taller.fechaFin)}`
                    : ""}
                </p>
                <p>
                  <strong style={{ color: "#5A0D0D" }}>Lugar: </strong>
                  {taller.lugar}
                </p>
                <p>
                  <strong style={{ color: "#5A0D0D" }}>Precio: </strong>
                  {Number(taller.precio || 0).toLocaleString("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  })}
                </p>
                <Link to={`/talleres/${taller.id}`} className="tp-btn">
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

  /* Page */
  .tp{min-height:100vh;background:#fff;padding:24px 14px;}
  @media (min-width:640px){.tp{padding:32px 20px;}}
  @media (min-width:1024px){.tp{padding:40px 24px;}}

  .tp-title{
    margin:0 0 24px;
    text-align:center;
    color:var(--wine);
    font-size:clamp(20px,3.2vw,32px);
    letter-spacing:.2px;
  }

  /* Empty / Error */
  .tp-empty{min-height:180px;display:flex;align-items:center;justify-content:center;color:var(--wine);}
  .tp-error{
    max-width:1100px;margin:40px auto;padding:24px;
    background:#fff0f0;color:var(--wine);
    border:2px solid var(--wine);border-radius:12px;text-align:center;font-weight:600;
  }

  /* Grid responsive */
  .tp-grid{
    list-style: none;
    margin: 0 auto;
    padding: 0;
    display: grid;
    gap: 18px;
    max-width: 1100px;
    grid-template-columns: 1fr; /* móvil */
    justify-items: start;
    align-items: stretch;
  }
  @media (min-width: 700px){
    .tp-grid{
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
      justify-items: start;
    }
  }
  @media (min-width: 1100px){
    .tp-grid{
      grid-template-columns: repeat(3, 1fr);
      gap: 28px;
      justify-items: start;
    }
  }

  /* Tarjeta estilo productos */
  .tp-card{
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    box-shadow: 0 8px 22px rgba(0,0,0,.07);
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: transform .16s, box-shadow .16s;
  }
  .tp-card:hover{
    transform: translateY(-2px);
    box-shadow: 0 16px 32px rgba(0,0,0,.10);
  }
  .tp-card-inner{
    padding: 18px 18px 12px 18px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .tp-card h3{
    margin: 0 0 6px;
    color: #5A0D0D;
    font-size: clamp(16px,2vw,20px);
    font-weight: 800;
  }
  .tp-card p{
    margin: 4px 0;
    line-height: 1.5;
    font-size: clamp(14px,1.9vw,16px);
  }
  .tp-btn{
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
  }
  .tp-btn:hover{
    filter: brightness(.96);
    transform: translateY(-1px);
  }
  @media (max-width:480px){ .tp-btn{display:block;width:100%;} }
`;