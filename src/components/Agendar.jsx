import { useState } from "react";
import Calendar from "./Calendar";
import FormCita from "./FormCita.jsx";

export default function AgendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div className="agendar-page">
            <style>{styles}</style>
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
    );
}

const styles = `
.agendar-page {
    background: #fff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}
.bu-hero {
    margin-top: 3vh;
    background: transparent;
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
}
.agendar-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    gap: 32px;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 12px;
}
.agendar-left,
.agendar-right {
    display: flex;
    justify-content: center;
    align-items: stretch;
    min-width: 0;
}
@media (max-width: 900px) {
    .agendar-container {
        gap: 18px;
        max-width: 98vw;
        padding: 18px 4px;
    }
    .agendar-left,
    .agendar-right {
        min-width: 0;
        width: 50%;
        padding: 0;
    }
}
@media (max-width: 700px) {
    .agendar-container {
        flex-direction: column;
        gap: 18px;
        align-items: center;
        padding: 12px 2px;
        max-width: 100vw;
    }
    .agendar-left,
    .agendar-right {
        width: 95%;
        min-width: 0;
        justify-content: center;
        align-items: center;
        padding: 0;
    }
}
`;
