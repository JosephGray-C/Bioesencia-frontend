// src/components/Calendario.jsx
import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useUser } from "../context/UserContext";
import { convertDateToTimeAmPm } from "../utils/formatDateTime.js";

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("citas");
    const [citas, setCitas] = useState([]);
    const [talleres, setTalleres] = useState([]);
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
            fetch(
                `http://localhost:8080/api/citas/agendadas/${fechaStr}/${uid}`
            )
                .then((res) => res.json())
                .then(setCitas)
                .catch(() => setCitas([]));
        } else {
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
            <header className="bu-hero">
                <div
                    className="bu-hero-inner"
                    style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}
                >
                    <p className="bu-hero-subtitle bu-hero-subtitle--spaced">
                        Consulta tus citas y talleres agendados en{" "}
                        <strong>Bioesencia</strong>.
                    </p>
                </div>
            </header>
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
                            className={`tabbtn ${
                                activeTab === "citas" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("citas")}
                        >
                            Citas
                        </button>
                        <button
                            className={`tabbtn ${
                                activeTab === "talleres" ? "active" : ""
                            }`}
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
                        <td
                            colSpan={5}
                            className="center"
                            style={{ padding: 32 }}
                        >
                            <span className="bu-empty-row">No hay citas</span>
                        </td>
                    </tr>
                ) : (
                    citas.map((c) => {
                        let fecha = "";
                        let hora = "";
                        if (c.fechaHora) {
                            const [f] = c.fechaHora
                                .replace("T", " ")
                                .split(" ");
                            fecha = f;
                            hora = convertDateToTimeAmPm(c.fechaHora);
                        }
                        return (
                            <tr key={c.id}>
                                <td>
                                    <span className="bu-servicio">
                                        {c.servicio}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-fecha">{fecha}</span>
                                </td>
                                <td>
                                    <span className="bu-hora">{hora}</span>
                                </td>
                                <td>
                                    <span
                                        className={`bu-estado bu-estado--${c.estado?.toLowerCase()}`}
                                    >
                                        {c.estado}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-notas">
                                        {c.notas || "—"}
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
                        <td
                            colSpan={7}
                            className="center"
                            style={{ padding: 32 }}
                        >
                            <span className="bu-empty-row">
                                No hay talleres
                            </span>
                        </td>
                    </tr>
                ) : (
                    talleres.map((t) => {
                        let horaInicio = "";
                        let horaFin = "";
                        if (t.fechaInicio) {
                            horaInicio = convertDateToTimeAmPm(t.fechaInicio);
                        }
                        if (t.fechaFin) {
                            horaFin = convertDateToTimeAmPm(t.fechaFin);
                        }
                        return (
                            <tr key={t.id}>
                                <td>
                                    <span className="bu-titulo">
                                        {t.titulo}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-lugar">{t.lugar}</span>
                                </td>
                                <td>
                                    <span className="bu-hora">
                                        {horaInicio}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-hora">{horaFin}</span>
                                </td>
                                <td className="center">
                                    <span className="bu-cupo">
                                        {t.cupoMaximo}
                                    </span>
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
                                    <span
                                        className={`bu-activo bu-activo--${
                                            t.activo ? "si" : "no"
                                        }`}
                                    >
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

  .calpage{ background:var(--bg); min-height:100vh; padding:16px 16px; display: flex; flex-direction: column; }
  .bu-hero {
    margin-top: 0;
    padding: 18px 16px 10px;
  }
  .bu-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-start;
    width: 100%;
  }
  .bu-hero-title {
    margin: 0 0 8px 0;
    color: #5A0D0D;
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: .2px;
  }
  .bu-hero-subtitle {
    margin: 0;
    color: #41503a;
    font-size: clamp(14px, 2vw, 17px);
    line-height: 1.7;
  }
  .bu-hero-subtitle--spaced {
    margin-top: 10px;
    margin-bottom: 18px;
    padding-top: 6px;
    padding-bottom: 6px;
    display: block;
  }
  @media (min-width:768px){ .calpage{ padding:40px 28px; } }

  .calgrid {
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 32px;
    justify-items: center;
    align-items: stretch;
  }
  @media (min-width:980px){
    .calgrid {
      max-width: 680px;
      gap: 40px;
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
    max-width: 680px;
    margin: 0 auto;
  }

  .tabs{
    display: flex;
    gap: 10px;
    margin: 24px 0 14px 0;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 24px;
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
    min-width: 600px;
    border-radius: 0 0 14px 14px;
    box-shadow: none;
    margin: 0;
    table-layout: auto;
    background: #fff;
    overflow: hidden;
    font-size: 1rem;
  }
  .bu-table th {
    background: #f6f7f9;
    color: #5A0D0D;
    font-weight: 800;
    padding: 14px 8px;
    border-bottom: 2px solid #e5e7eb;
    text-align: left;
    white-space: nowrap;
  }
  .bu-table td {
    padding: 12px 8px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: middle;
    word-break: break-word;
    background: #fff;
    transition: background .12s;
  }
  .bu-table tr:nth-child(even) td {
    background: #f8fafb;
  }
  .bu-table tr:hover td {
    background: #eef6ee;
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

  /* Responsive styles */
  @media (max-width: 900px) {
    .bu-table {
      min-width: 480px;
      font-size: .97rem;
    }
    .bu-table th, .bu-table td {
      padding: 10px 6px;
    }
  }
  @media (max-width: 700px) {
    .bu-table {
      min-width: 340px;
      font-size: .95rem;
    }
    .bu-table th, .bu-table td {
      padding: 8px 4px;
    }
    .tablewrap {
      border-radius: 0 0 10px 10px;
      min-height: 120px;
    }
  }
`;
