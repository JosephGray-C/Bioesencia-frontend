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
    <table>
      <thead>
        <tr>
          <th>Fecha y hora</th>
          <th>Servicio</th>
          <th className="center">Estado</th>
          <th>Notas</th>
        </tr>
      </thead>
      <tbody>
        {citas.length === 0 ? (
          <tr>
            <td colSpan={4} className="center" style={{ padding: 20 }}>
              No hay citas
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
                  {fecha} {hora}
                </td>
                <td>{c.servicio}</td>
                <td className="center">{c.estado}</td>
                <td>{c.notas}</td>
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
    <table>
      <thead>
        <tr>
          <th>Título</th>
          <th>Fecha inicio</th>
          <th>Fecha fin</th>
          <th>Lugar</th>
          <th className="center">Cupo</th>
          <th className="center">Precio</th>
          <th className="center">Activo</th>
        </tr>
      </thead>
      <tbody>
        {talleres.length === 0 ? (
          <tr>
            <td colSpan={7} className="center" style={{ padding: 20 }}>
              No hay talleres
            </td>
          </tr>
        ) : (
          talleres.map((t) => {
            let fechaInicio = "";
            let horaInicio = "";
            let fechaFin = "";
            let horaFin = "";
            if (t.fechaInicio) {
              const [f] = t.fechaInicio.replace("T", " ").split(" ");
              fechaInicio = f;
              horaInicio = formatoHoraAmPm(t.fechaInicio);
            }
            if (t.fechaFin) {
              const [f] = t.fechaFin.replace("T", " ").split(" ");
              fechaFin = f;
              horaFin = formatoHoraAmPm(t.fechaFin);
            }
            return (
              <tr key={t.id}>
                <td>{t.titulo}</td>
                <td>
                  {fechaInicio} {horaInicio}
                </td>
                <td>
                  {fechaFin} {horaFin}
                </td>
                <td>{t.lugar}</td>
                <td className="center">{t.cupoMaximo}</td>
                <td className="center">
                  {t.precio?.toLocaleString("es-CR", {
                    style: "currency",
                    currency: "CRC",
                  })}
                </td>
                <td className="center">{t.activo ? "Sí" : "No"}</td>
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
    gap:20px;
    justify-items:center;
    align-items:start;
  }
  @media (min-width:980px){
    .calgrid{
      grid-template-columns: minmax(360px, 430px) minmax(420px, 680px);
      grid-template-areas: "calendar content";
      gap:24px;
    }
  }

  .left{ grid-area: calendar; width:100%; }
  .right{ grid-area: content; width:100%; }

  .card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:16px;
    box-shadow:var(--shadow);
    padding:20px;
  }
  @media (min-width:768px){ .card{ padding:24px; } }

  .tabs{
    display:flex;
    gap:10px;
    margin-bottom:14px;
    flex-wrap:wrap;
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

  .tablewrap{
    width:100%;
    overflow-x:auto;
    border-radius:12px;
    border:1px solid var(--line);
    background:#fff;
    box-shadow:var(--shadow);
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  table{
    width:100%;
    border-collapse:collapse;
    background:#fff;
    color:var(--ink);
    min-width:640px;
    min-height: 120px;
  }
  thead tr{ background:#f7f9fb; }
  th, td{ padding:12px; }
  th{ text-align:left; font-weight:800; color:var(--ink); }
  td{ border-top:1px solid #eef2f7; }
  tbody tr:hover{ background:#fafbfd; }
        td.center, th.center{ text-align:center; }
`;