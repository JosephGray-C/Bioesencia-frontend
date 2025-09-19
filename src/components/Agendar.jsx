import { useState } from "react";
import Calendar from "./Calendar";
import FormCita from "./FormCita.jsx";

export default function AgendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div className="agendar-page">
            <header className="bu-hero">
                <div
                    className="bu-hero-inner"
                    style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}
                >
                    <p className="bu-hero-subtitle">
                        Reserva tu cita en <strong>Bioesencia</strong> eligiendo
                        fecha y servicio.
                    </p>
                </div>
            </header>
            <div style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}>
                <div className="agendar-container">
                    <div className="agendar-left">
                        <Calendar
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            component={"agendar"}
                        />
                    </div>
                    <div className="agendar-right">
                        <FormCita selectedDate={selectedDate} />
                    </div>
                </div>
            </div>
        </div>
    );
}
