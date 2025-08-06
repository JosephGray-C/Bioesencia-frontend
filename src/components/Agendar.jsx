// Imports
import { useState } from "react";
import { useAgendar } from "../hooks/useAgendar";
import { useServicios } from "../hooks/useServicios";
import { useHorarios } from "../hooks/useHorarios";
import Calendar from "./Calendar";

export default function AgendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHora, setSelectedHora] = useState(null);
  const [notas, setNotas] = useState("");
  const [servicio, setServicio] = useState("");
  const serviciosDisponibles = useServicios();
  const [horariosDisponibles, setHorariosDisponibles] = useHorarios(selectedDate);
  const { mensaje, solicitarCita } = useAgendar();

  return (
    <>
      <section className="home-main">
        <div className="agendar-container">
          <div className="left">
            <Calendar
              setSelectedDate={setSelectedDate}
              selectedDate={selectedDate}
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
                  {Array.isArray(horariosDisponibles) &&
                  horariosDisponibles.length > 0 ? (
                    horariosDisponibles.map((hora) => (
                      <button
                        key={hora}
                        className={`horario-btn${
                          selectedHora === hora ? " selected" : ""
                        }`}
                        onClick={() => setSelectedHora(hora)}
                      >
                        {hora}
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
                  disabled={!selectedHora}
                  onClick={() =>
                    solicitarCita({
                      selectedHora,
                      selectedDate,
                      notas,
                      servicio,
                      setHorariosDisponibles
                    })
                  }
                >
                  Solicitar cita
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
