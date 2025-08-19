// src/components/Calendario.jsx
import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useUser } from "../context/UserContext";

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState("citas");
  const [citas, setCitas] = useState([]); // Cambia null por []
  const [talleres, setTalleres] = useState([]); // Cambia null por []
  const { user } = useUser();

  useEffect(() => {
    const uid = user?.id;
    if (!uid) return;

    const fechaStr =
      selectedDate.getFullYear() +
      "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(selectedDate.getDate()).padStart(2, "0");

    if (activeTab === "citas") {
      // Elimina setCitas(null);
      fetch(`http://localhost:8080/api/citas/agendadas/${fechaStr}/${uid}`)
        .then((res) => res.json())
        .then(setCitas)
        .catch(() => setCitas([]));
    } else {
      // Elimina setTalleres(null);
      fetch(
        `http://localhost:8080/api/inscripciones/agendadas/${fechaStr}/${uid}`
      )
        .then((res) => res.json())
        .then(setTalleres)
        .catch(() => setTalleres([]));
    }
  }, [selectedDate, activeTab, user?.id]);

  return (
    <section className="calpage">
      <style>{styles}</style>
      <div className="calgrid">
        <div className="left">
          <Calendar
            setSelectedDate={setSelectedDate}
            selectedDate={selectedDate}
            comp="calendario"
          />
        </div>
        <div className="right card">
          <div className="tabs">
            <button
              className={`tabbtn ${activeTab === "citas" ? "active" : ""}`}
              onClick={() => setActiveTab("citas")}
            >
              Citas
            </button>
            <button
              className={`tabbtn ${activeTab === "talleres" ? "active" : ""}`}
              onClick={() => setActiveTab("talleres")}
            >
              Talleres
            </button>
          </div>
          <div className="tablewrap">
            {activeTab === "citas" ? (
              <TablaCitas citas={citas} />
            ) : (
              <TablaTalleres talleres={talleres} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatoHoraAmPm(horaStr) {
  if (!horaStr) return "";
  // horaStr puede venir como "2025-08-18 09:00:00" o "2025-08-18T09:00:00"
  const match = horaStr.match(/(\d{2}):(\d{2})(?::\d{2})?/);
  if (!match) return horaStr;
  let h = parseInt(match[1], 10);
  let m = match[2];
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${m} ${ampm}`;
}

function TablaCitas({ citas }) {
  if (!citas) citas = [];
  return (
    <table className="bu-table">
      <thead>
        <tr>
          <th>Servicio</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Notas</th>
        </tr>
      </thead>
      <tbody>
        {citas.length === 0 ? (
          <tr>
            <td colSpan={5} className="center" style={{ padding: 32 }}>
              <span className="bu-empty-row">No hay citas</span>
            </td>
          </tr>
        ) : (
          citas.map((c) => {
            let fecha = "";
            let hora = "";
            if (c.fechaHora) {
              const [f] = c.fechaHora.replace("T", " ").split(" ");
              fecha = f;
              hora = formatoHoraAmPm(c.fechaHora);
            }
            return (
              <tr key={c.id}>
                <td>
                  <span className="bu-servicio">{c.servicio}</span>
                </td>
                <td>
                  <span className="bu-fecha">{fecha}</span>
                </td>
                <td>
                  <span className="bu-hora">{hora}</span>
                </td>
                <td>
                  <span className={`bu-estado bu-estado--${c.estado?.toLowerCase()}`}>
                    {c.estado}
                  </span>
                </td>
                <td>
                  <span className="bu-notas">{c.notas || "—"}</span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

function TablaTalleres({ talleres }) {
  if (!talleres) talleres = [];
  return (
    <table className="bu-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Lugar</th>
          <th>Inicio</th>
          <th>Fin</th>
          <th className="center">Cupo</th>
          <th className="center">Precio</th>
          <th className="center">Activo</th>
        </tr>
      </thead>
      <tbody>
        {talleres.length === 0 ? (
          <tr>
            <td colSpan={7} className="center" style={{ padding: 32 }}>
              <span className="bu-empty-row">No hay talleres</span>
            </td>
          </tr>
        ) : (
          talleres.map((t) => {
            let horaInicio = "";
            let horaFin = "";
            if (t.fechaInicio) {
              horaInicio = formatoHoraAmPm(t.fechaInicio);
            }
            if (t.fechaFin) {
              horaFin = formatoHoraAmPm(t.fechaFin);
            }
            return (
              <tr key={t.id}>
                <td>
                  <span className="bu-titulo">{t.titulo}</span>
                </td>
                <td>
                  <span className="bu-lugar">{t.lugar}</span>
                </td>
                <td>
                  <span className="bu-hora">{horaInicio}</span>
                </td>
                <td>
                  <span className="bu-hora">{horaFin}</span>
                </td>
                <td className="center">
                  <span className="bu-cupo">{t.cupoMaximo}</span>
                </td>
                <td className="center">
                  <span className="bu-precio">
                    {t.precio?.toLocaleString("es-CR", {
                      style: "currency",
                      currency: "CRC",
                    })}
                  </span>
                </td>
                <td className="center">
                  <span className={`bu-activo bu-activo--${t.activo ? "si" : "no"}`}>
                    {t.activo ? "Sí" : "No"}
                  </span>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

const styles = `
  :root{
    --wine:#5A0D0D;
    --green:#A9C499;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#ffffff;
    --bg:#ffffff;
    --shadow:0 12px 28px rgba(0,0,0,.06);
  }

  .calpage{ background:var(--bg); min-height:100vh; padding:32px 16px; }
  @media (min-width:768px){ .calpage{ padding:40px 28px; } }

  .calgrid{
    max-width:1150px;
    margin:0 auto;
    display:grid;
    grid-template-columns: 1fr;
    grid-template-areas:
      "calendar"
      "content";
    gap:32px;
    justify-items:center;
    align-items:start;
  }
  @media (min-width:980px){
    .calgrid{
      grid-template-columns: minmax(340px, 420px) minmax(420px, 680px);
      grid-template-areas: "calendar content";
      gap:40px;
    }
  }

  .left{ grid-area: calendar; width:100%; display:flex; align-items:center; justify-content:center; }
  .right{ grid-area: content; width:100%; }

  .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:18px;
    box-shadow:var(--shadow);
    padding:0;
    overflow:hidden;
    display:flex;
    flex-direction:column;
    min-height: 320px;
    width: 100%;
    max-width: 680px; /* Puedes ajustar este valor */
    margin: 0 auto;
  }

  .tabs{
    display: flex;
    gap: 10px;
    margin: 24px 0 14px 0;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 24px; /* buen padding izquierdo */
  }
  @media (max-width:700px){
    .tabs{
      padding-left: 10px;
      margin: 18px 0 10px 0;
      gap: 6px;
    }
  }
  .tabbtn{
    padding:8px 18px;
    border-radius:10px;
    border:1px solid var(--line);
    background:#f3f4f6;
    color:var(--ink);
    font-weight:700;
    cursor:pointer;
    transition:transform .12s ease, box-shadow .12s ease, background .12s ease;
  }
  .tabbtn:hover{ transform:translateY(-1px); box-shadow:var(--shadow); background:#eef2f7; }
  .tabbtn.active{ background:var(--green); color:var(--wine); border-color:var(--green); }

  table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
    color:var(--ink);
    min-width:640px;
    min-height: 120px;
    font-size:1.04rem;
    margin:0;
  }
  thead tr{ background:#f7f9fb; }
  th, td{ padding:14px 10px; }
  th{ text-align:left; font-weight:800; color:var(--ink); background:#f7f9fb; }
  td{ border-top:1px solid #eef2f7; }
  tbody tr:hover{ background:#fafbfd; }
  td.center, th.center{ text-align:center; }
  @media (max-width:700px){
    table{ min-width:0; font-size:.98rem; }
    th, td{ padding:10px 6px; }
  }

  .bu-table {
    width: 100%;
    min-width: 900px; /* Fuerza el scroll horizontal si hay muchas columnas */
    border-radius: 0 0 14px 14px;
    box-shadow: none;
    margin: 0;
    table-layout: fixed;
  }
  .bu-table th {
    background: #f6f7f9;
    color: #5A0D0D;
    font-weight: 800;
    padding: 16px 10px;
    border-bottom: 2px solid #e5e7eb;
    text-align: left;
  }
  .bu-table td {
    padding: 14px 10px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
  }
  .bu-table tr:last-child td {
    border-bottom: none;
  }
  .bu-empty-row {
    color: #6b7280;
    font-size: 1.08rem;
    font-weight: 600;
    letter-spacing: .5px;
  }
  .bu-servicio, .bu-titulo, .bu-lugar, .bu-hora, .bu-cupo, .bu-precio, .bu-fecha, .bu-notas {
    font-weight: 600;
    color: #23272f;
    font-size: 1rem;
  }
  @media (max-width:700px){
    .bu-table th, .bu-table td { padding: 10px 6px; font-size: .97rem; }
  }
  .tablewrap {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    border-radius: 0 0 18px 18px;
    background: #fff;
    box-shadow: none;
    min-height: 180px;
    display: block;
    padding: 0;
  }
`;