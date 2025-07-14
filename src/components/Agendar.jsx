// Imports
import { useState } from "react";

import Calendar from "./Calendar";

const horariosDisponibles = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
];



export default function AgendarPage() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHora, setSelectedHora] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const solicitarCita = async () => {
        if (selectedDate && selectedHora) {
            try {
                // Convierte la hora seleccionada a formato 24h
                const [hora, minutos, periodo] = selectedHora.match(/(\d+):(\d+) (\w+)/).slice(1);
                let hora24 = parseInt(hora, 10);
                if (periodo === "PM" && hora24 !== 12) hora24 += 12;
                if (periodo === "AM" && hora24 === 12) hora24 = 0;

                // Construye el string fechaHora
                const fechaStr = selectedDate.toISOString().split("T")[0];
                const horaStr = hora24.toString().padStart(2, "0") + ":" + minutos + ":00";
                const fechaHora = `${fechaStr}T${horaStr}`;

                const cita = {
                    fechaHora,
                    duracion: 60,
                    servicio: "terapia Reiki",
                    estado: "PENDIENTE",
                    notas: "Primera cita del paciente"
                };

                console.log(cita)

                // const response = await fetch("http://localhost:8080/api/citas", {
                //     method: "POST",
                //     headers: {
                //         "Content-Type": "application/json"
                //     },
                //     body: JSON.stringify(cita)
                // });

                // if (response.ok) {
                    setMensaje(
                        `Cita solicitada para el ${selectedDate.toLocaleDateString()} a las ${selectedHora}`
                    );
                // } else {
                //     setMensaje("Error al solicitar la cita.");
                // }
            } catch (error) {
                setMensaje("Error de conexión al solicitar la cita." + error.message);
            }
        }
    };

    return (
        <>
            <section className="responsive">
                <div className="agendar-container">
                    
                    <div className="left">
                        <Calendar setSelectedDate={setSelectedDate} selectedDate={selectedDate}/>
                    </div>

                    <div className="right"> 
                        {selectedDate && (
                            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                                <p>
                                    Fecha seleccionada: {selectedDate.toLocaleDateString()}
                                </p>
                                <div>
                                    <p>Selecciona un horario:</p>
                                    {horariosDisponibles.map((hora) => (
                                        <button
                                            key={hora}
                                            className={`horario-btn${selectedHora === hora ? " selected" : ""}`}
                                            onClick={() => setSelectedHora(hora)}
                                        >
                                            {hora}
                                        </button>
                                    ))}
                                </div>
                                <button className="solicitar-btn" disabled={!selectedHora} onClick={solicitarCita}>
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
