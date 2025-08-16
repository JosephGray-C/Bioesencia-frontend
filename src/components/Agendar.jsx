// Imports
import { useState, useEffect } from "react";
import { useAgendar } from "../hooks/useAgendar";
import { useServicios } from "../hooks/useServicios";
import Calendar from "./Calendar";

function useHorarios(selectedDate) {
  const [horarios, setHorarios] = useState([]);
  
  useEffect(() => {
    if (!selectedDate) return;

    const fechaStr = selectedDate.getFullYear() + "-" +
    String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
    String(selectedDate.getDate()).padStart(2, "0");
  
    fetch(`http://localhost:8080/api/citas/horariosDisponibles?fecha=${fechaStr}`)
    .then(res => res.json())
    .then(setHorarios);
  }, [selectedDate]); 
  
  return [horarios, setHorarios];
}

function ServicioSelector({ servicio, setServicio, serviciosDisponibles }) {
  useEffect(() => {
    if (
      serviciosDisponibles.length > 0 &&
      (servicio === "" || !serviciosDisponibles.some(s => (s.nombre || s) === servicio))
    ) {
      setServicio(serviciosDisponibles[0].nombre || serviciosDisponibles[0]);
    }
  }, [serviciosDisponibles, servicio, setServicio]);
  
  return (
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

  return horarios.filter(hora => {
    const [h] = hora.split(":").map(Number);
    return h >= 9 && h <= 15; // Solo horarios de 9:00 a 15:59
  });
}

function HorariosSelector({horariosDisponibles, selectedDate, selectedHora, setSelectedHora, formatoHoraAmPm, horariosParaMostrar}) {
  const horariosFiltrados = horariosParaMostrar(horariosDisponibles, selectedDate);
  
  return (
    <div>
      <p>Selecciona un horario:</p>
      {Array.isArray(horariosFiltrados) && horariosFiltrados.length > 0 ? (
        horariosFiltrados.map((hora) => (
          <button
            key={hora}
            className={`horario-btn${selectedHora === hora ? " selected" : ""}`}
            onClick={() => setSelectedHora(hora)}
          >
            {formatoHoraAmPm(hora)}
          </button>
        ))
      ) : (
        <p>No hay horarios disponibles para este día.</p>
      )}
    </div>
  );
}

export default function AgendarPage() {
  // Estado para manejar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState();
  const [selectedHora, setSelectedHora] = useState(null); 
  
  // Estado para manejar el servicio seleccionado
  const [servicio, setServicio] = useState("");
  const serviciosDisponibles = useServicios();

  // Filtrar horarios según la fecha seleccionada
  const [horariosDisponibles, setHorariosDisponibles] = useHorarios(selectedDate);
  
  // Estado para manejar las notas
  const [notas, setNotas] = useState("");
  
  // Estado para manejar el proceso de agendado
  const [procesando, setProcesando] = useState(false);
  
  // Hook personalizado para manejar la lógica de agendar
  const { mensaje, solicitarCita } = useAgendar();

  const limpiarForm = () => {
    setSelectedHora(null);
    setServicio(serviciosDisponibles[0]?.nombre || "");
    setSelectedDate(undefined);
    setNotas("");
  };

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
                  formatoHoraAmPm={formatoHoraAmPm}
                  horariosParaMostrar={horariosParaMostrar}
                />
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
                    setHorariosDisponibles, // <-- aquí se pasa el setter
                    setProcesando,
                    onSuccess: limpiarForm // <-- pasa el callback aquí
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