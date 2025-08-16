import { useState, useEffect } from "react";
import { useAgendar } from "../hooks/useAgendar";
import { useServicios } from "../hooks/useServicios";
import Calendar from "./Calendar";

function useHorarios(selectedDate) {
  const [horarios, setHorarios] = useState([]);
  useEffect(() => {
    if (!selectedDate) return;
    const fechaStr =
      selectedDate.getFullYear() +
      "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(selectedDate.getDate()).padStart(2, "0");
    fetch(`http://localhost:8080/api/citas/horariosDisponibles?fecha=${fechaStr}`)
      .then((res) => res.json())
      .then(setHorarios)
      .catch(() => setHorarios([]));
  }, [selectedDate]);
  return [horarios, setHorarios];
}

function ServicioSelector({ servicio, setServicio, serviciosDisponibles }) {
  useEffect(() => {
    if (
      serviciosDisponibles.length > 0 &&
      (servicio === "" || !serviciosDisponibles.some((s) => (s.nombre || s) === servicio))
    ) {
      setServicio(serviciosDisponibles[0].nombre || serviciosDisponibles[0]);
    }
  }, [serviciosDisponibles, servicio, setServicio]);

  return (
    <div className="field">
      <label htmlFor="servicio" className="label">Servicio</label>
      <select
        id="servicio"
        value={servicio}
        onChange={(e) => setServicio(e.target.value)}
        className="select"
      >
        {serviciosDisponibles.map((s) => (
          <option key={s.id || s} value={s.nombre || s}>
            {s.nombre || s}
          </option>
        ))}
      </select>
    </div>
  );
}

function formatoHoraAmPm(hora24) {
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}
function horariosParaMostrar(horarios, selectedDate) {
  if (!selectedDate || selectedDate.getDay() !== 6) return horarios;
  return horarios.filter((hora) => {
    const [h] = hora.split(":").map(Number);
    return h >= 9 && h <= 15;
  });
}

function HorariosSelector({
  horariosDisponibles,
  selectedDate,
  selectedHora,
  setSelectedHora,
}) {
  const visibles = horariosParaMostrar(horariosDisponibles, selectedDate);
  return (
    <div className="field">
      <span className="label">Selecciona un horario</span>
      {Array.isArray(visibles) && visibles.length > 0 ? (
        <div className="horarios-grid">
          {visibles.map((hora) => (
            <button
              key={hora}
              className={"horario-btn" + (selectedHora === hora ? " selected" : "")}
              onClick={() => setSelectedHora(hora)}
              type="button"
            >
              {formatoHoraAmPm(hora)}
            </button>
          ))}
        </div>
      ) : (
        <p className="empty">No hay horarios disponibles para este día.</p>
      )}
    </div>
  );
}

export default function AgendarPage() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedHora, setSelectedHora] = useState(null);
  const [servicio, setServicio] = useState("");
  const serviciosDisponibles = useServicios();
  const [horariosDisponibles, setHorariosDisponibles] = useHorarios(selectedDate);
  const [notas, setNotas] = useState("");
  const [procesando, setProcesando] = useState(false);
  const { mensaje, solicitarCita } = useAgendar();

  const limpiarForm = () => {
    setSelectedHora(null);
    setServicio(serviciosDisponibles[0]?.nombre || "");
    setSelectedDate(undefined);
    setNotas("");
  };

  return (
    <section className="agendar">
      <style>{`
        :root{
          --wine:#5A0D0D;
          --green:#A9C499;
          --ink:#1f2937;
          --muted:#6b7280;
          --bg:#ffffff;
          --card:#ffffff;
          --line:#e5e7eb;
        }
        .agendar, .agendar * { box-sizing: border-box; }
        .agendar{ background:var(--bg); min-height:100vh; padding:32px 16px; }
        @media (min-width:768px){ .agendar{ padding:40px 28px; } }
        .agendar-container{
          max-width:1150px;
          margin:0 auto;
          display:grid;
          gap:36px;
          grid-template-columns: 1fr;
          grid-template-areas:
            "agenda"
            "calendar";
          justify-items:center;
        }
        @media (min-width:980px){
          .agendar-container{
            grid-template-columns: minmax(360px, 430px) minmax(360px, 430px);
            grid-template-areas: "calendar agenda";
            gap: 56px;
            justify-content:center;
            justify-items:center;
            align-items:start;
          }
        }
        .left{ grid-area: calendar; }
        .right{ grid-area: agenda; }
        .card{
          width:100%;
          background:var(--card);
          border:1px solid var(--line);
          border-radius:16px;
          box-shadow:0 12px 28px rgba(0,0,0,.06);
        }
        .card-pad{ padding:20px; }
        @media (min-width:768px){ .card-pad{ padding:24px; } }
        .calendar-shell{
          width:100%;
          background:transparent;
          border:none;
          border-radius:0;
          box-shadow:none;
          padding:0;
        }
        .left .calendar-shell{ max-width: 760px; }
        .right .card{ max-width: 760px; }
        @media (min-width:980px){
          .left .calendar-shell{ max-width: 430px; }
          .right .card{ max-width: 430px; }
        }
        .title{
          font-weight:800;
          color:var(--wine);
          margin:6px 0 18px;
          font-size:clamp(18px,2.2vw,22px);
        }
        .label{
          display:block;
          font-weight:700;
          color:var(--wine);
          margin-bottom:10px;
          font-size:.98rem;
        }
        .field{ margin-bottom:18px; width:100%; }
        .select{
          width:100%;
          max-width:100%;
          padding:12px 14px;
          border:1px solid var(--line);
          border-radius:12px;
          background:#fff;
          color:var(--ink);
          display:block;
        }
        @media (min-width:980px){
          .select{ width:260px; max-width:100%; }
        }
        .horarios-grid{ display:flex; flex-wrap:wrap; gap:12px; }
        .horario-btn{
          border:1px solid var(--line);
          background:#f6f7f8;
          color:var(--ink);
          border-radius:12px;
          padding:10px 14px;
          font-weight:700;
          font-size:.96rem;
          transition:transform .12s ease, box-shadow .12s ease, background .12s ease, color .12s ease;
        }
        .horario-btn:hover{ transform:translateY(-1px); box-shadow:0 10px 22px rgba(0,0,0,.06); }
        .horario-btn.selected{
          background:var(--green);
          color:var(--wine);
          border-color:var(--green);
        }
        .textarea{
          width:100%;
          max-width:100%;
          min-height:120px;
          resize:vertical;
          border:1px solid var(--line);
          border-radius:12px;
          padding:12px 14px;
          color:var(--ink);
        }
        .actions{ display:flex; gap:14px; align-items:center; flex-wrap:wrap; margin-top:16px; }
        .solicitar-btn{
          background:var(--wine);
          color:#fff;
          border:none;
          border-radius:12px;
          padding:12px 18px;
          font-weight:800;
          cursor:pointer;
          transition:transform .12s ease, box-shadow .12s ease, opacity .12s ease;
        }
        .solicitar-btn:hover{ transform:translateY(-1px); box-shadow:0 12px 28px rgba(0,0,0,.12); }
        .solicitar-btn:disabled{ opacity:.7; cursor:not-allowed; }
        .empty{ color:var(--muted); }
      `}</style>

      <div className="agendar-container">
        <div className="left">
          <div className="calendar-shell">
            <Calendar
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              comp="agendar"
            />
          </div>
        </div>

        <div className="right">
          <div className="card card-pad">
            <h2 className="title">Agendar cita</h2>

            {selectedDate ? (
              <>
                <p style={{ color: "var(--ink)", marginBottom: 14 }}>
                  Fecha seleccionada: <strong>{selectedDate.toLocaleDateString()}</strong>
                </p>

                <ServicioSelector
                  servicio={servicio}
                  setServicio={setServicio}
                  serviciosDisponibles={serviciosDisponibles}
                />

                <HorariosSelector
                  horariosDisponibles={horariosDisponibles}
                  selectedDate={selectedDate}
                  selectedHora={selectedHora}
                  setSelectedHora={setSelectedHora}
                />

                <div className="field" style={{ marginTop: 10 }}>
                  <label className="label">Notas (opcional)</label>
                  <textarea
                    className="textarea"
                    placeholder="Notas para la cita"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="actions">
                  <button
                    className="solicitar-btn"
                    disabled={!selectedHora || procesando}
                    onClick={() =>
                      solicitarCita({
                        selectedHora,
                        selectedDate,
                        notas,
                        servicio,
                        setHorariosDisponibles,
                        setProcesando,
                        onSuccess: limpiarForm,
                      })
                    }
                  >
                    {procesando ? "Procesando..." : "Solicitar cita"}
                  </button>
                  {mensaje && (
                    <span style={{ color: "green", fontWeight: 700 }}>{mensaje}</span>
                  )}
                </div>
              </>
            ) : (
              <p className="empty">Selecciona un día en el calendario para continuar.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
