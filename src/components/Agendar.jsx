import { useState } from "react";
import Calendar from "./Calendar";
import FormCita from "./FormCita.jsx";

export default function AgendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return (
        <div className="agendar-container">
            <style>{styles}</style>
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
    );
}

const styles = `
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
