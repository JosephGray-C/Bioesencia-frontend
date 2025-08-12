// Imports
import { useState, useEffect } from "react";
import { useAgendar } from "../hooks/useAgendar";
import { useServicios } from "../hooks/useServicios";
import { useHorarios } from "../hooks/useHorarios";
import Calendar from "./Calendar";

function formatoHoraAmPm(hora24) {
  const [h, m] = hora24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export default function AgendarPage() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedHora, setSelectedHora] = useState(null);
  const [notas, setNotas] = useState("");
  const [procesando, setProcesando] = useState(false); // Nuevo estado
  const [servicio, setServicio] = useState("");
  const serviciosDisponibles = useServicios();
  const [horariosDisponibles, setHorariosDisponibles] = useHorarios(selectedDate);
  const { mensaje, solicitarCita } = useAgendar();

  useEffect(() => {
    if (
      serviciosDisponibles.length > 0 &&
      (servicio === "" || !serviciosDisponibles.some(s => (s.nombre || s) === servicio))
    ) {
      setServicio(serviciosDisponibles[0].nombre || serviciosDisponibles[0]);
    }
  }, [serviciosDisponibles, servicio]);

  // Filtra los horarios si es sábado
  let horariosParaMostrar = horariosDisponibles;
  if (
    selectedDate &&
    selectedDate.getDay() === 6 // 6 = sábado
  ) {
    horariosParaMostrar = horariosDisponibles.filter(hora => {
      // Asume formato "HH:mm"
      const [h, m] = hora.split(":").map(Number);
      return h >= 9 && h <= 15;
    });
  }

  return (
    <>
      <section className="home-main">
        <div className="agendar-container">
          <div className="left">
            <Calendar
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
              comp="agendar"
            />
          </div>

          <div className="right">
            {selectedDate && (
              <div style={{ justifyContent: "center", marginTop: "1rem" }}>
                <p style={{ marginBottom: "1rem" }}>
                  Fecha seleccionada: {selectedDate.toLocaleDateString()}
                </p>
                {/* Dropdown para seleccionar servicio */}
                <div style={{ margin: "1rem 0" }}>
                  <label htmlFor="servicio" style={{ marginRight: 8 }}>
                    Servicio:
                  </label>
                  <select
                    id="servicio"
                    value={servicio}
                    onChange={(e) => setServicio(e.target.value)}
                    style={{ padding: 6, borderRadius: 6 }}
                  >
                    {serviciosDisponibles.map((s) => (
                      <option key={s.id || s} value={s.nombre || s}>
                        {s.nombre || s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p>Selecciona un horario:</p>
                  {Array.isArray(horariosParaMostrar) && horariosParaMostrar.length > 0 ? (
                    horariosParaMostrar.map((hora) => (
                      <button
                        key={hora}
                        className={`horario-btn${
                          selectedHora === hora ? " selected" : ""
                        }`}
                        onClick={() => setSelectedHora(hora)}
                      >
                        {formatoHoraAmPm(hora)}
                      </button>
                    ))
                  ) : (
                    <p>No hay horarios disponibles para este día.</p>
                  )}
                </div>
                {/* Caja de texto para notas */}
                <div style={{ marginTop: "1rem" }}>
                  <textarea
                    placeholder="Notas para la cita (opcional)"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    rows={3}
                    style={{
                      width: "90%",
                      borderRadius: 6,
                      padding: 8,
                      resize: "vertical",
                    }}
                  />
                </div>
                <button
                  className="solicitar-btn"
                  disabled={!selectedHora || procesando}
                  onClick={() => solicitarCita({
                    selectedHora,
                    selectedDate,
                    notas,
                    servicio,
                    setHorariosDisponibles,
                    setProcesando // <-- pasa el setter aquí
                  })}
                >
                  {procesando ? "Procesando..." : "Solicitar cita"}
                </button>
                {mensaje && (
                  <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
