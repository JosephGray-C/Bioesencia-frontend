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
      <style>{`
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
          list-style:none;margin:0 auto;padding:0;display:grid;gap:16px;max-width:1100px;
          grid-template-columns:1fr; /* móvil */
        }
        @media (min-width:800px){ .tp-grid{grid-template-columns:repeat(2,1fr);gap:20px;} }
        @media (min-width:1200px){ .tp-grid{grid-template-columns:repeat(3,1fr);gap:24px;} }

        /* Card */
        .tp-card{
          background:#fff;border:1px solid var(--border);
          border-radius:12px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.06);
          color:var(--text);transition:transform .15s ease, box-shadow .15s ease;
        }
        .tp-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,0,0,.08);}
        .tp-card h3{margin:0 0 8px;color:var(--wine);font-size:clamp(16px,2vw,20px);}
        .tp-card p{margin:6px 0;line-height:1.5;font-size:clamp(14px,1.9vw,16px);}

        /* Button */
        .tp-btn{
          display:inline-block;margin-top:10px;padding:10px 16px;
          background:var(--green);color:var(--wine);text-decoration:none;
          border-radius:8px;font-weight:800;text-align:center;
          transition:transform .15s ease, filter .15s ease;
        }
        .tp-btn:hover{filter:brightness(.96);transform:translateY(-1px);}
        @media (max-width:480px){ .tp-btn{display:block;width:100%;} }
      `}</style>

      <h2 className="tp-title">Talleres disponibles</h2>

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
              <h3>{taller.titulo}</h3>
              {taller.descripcion && <p>{taller.descripcion}</p>}
              <p>
                <strong style={{ color: "var(--wine)" }}>Fecha: </strong>
                {taller.fechaInicio ? new Date(taller.fechaInicio).toLocaleString() : "—"} –{" "}
                {taller.fechaFin ? new Date(taller.fechaFin).toLocaleString() : "—"}
              </p>
              <p>
                <strong style={{ color: "var(--wine)" }}>Lugar: </strong>
                {taller.lugar}
              </p>
              <p>
                <strong style={{ color: "var(--wine)" }}>Precio: </strong>
                {Number(taller.precio || 0).toLocaleString("es-CR", {
                  style: "currency",
                  currency: "CRC",
                })}
              </p>
              <Link to={`/talleres/${taller.id}`} className="tp-btn">
                Ver más
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
