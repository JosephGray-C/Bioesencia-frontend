import { useState, useEffect } from "react";
import Calendar from "./Calendar";

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("citas");
    const [citas, setCitas] = useState([]);
    const [talleres, setTalleres] = useState([]);

    useEffect(() => {
        const fechaStr = selectedDate.toISOString().split("T")[0];
        if (activeTab === "citas") {
            fetch(`http://localhost:8080/api/citas?fecha=${fechaStr}`)
                .then(res => res.json())
                .then(setCitas);
        } else {
            fetch(`http://localhost:8080/api/talleres?fecha=${fechaStr}`)
                .then(res => res.json())
                .then(setTalleres);
        }
    }, [selectedDate, activeTab]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Calendar
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
            />

            {/* Tabs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                <button
                    onClick={() => setActiveTab("citas")}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: activeTab === "citas" ? "#5EA743" : "#23272f",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    Citas
                </button>
                <button
                    onClick={() => setActiveTab("talleres")}
                    style={{
                        padding: "10px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: activeTab === "talleres" ? "#5EA743" : "#23272f",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer"
                    }}
                >
                    Talleres
                </button>
            </div>

            {/* Table */}
            {activeTab === "citas" ? (
                <TablaCitas citas={citas} />
            ) : (
                <TablaTalleres talleres={talleres} />
            )}
        </div>
    );
}

// Puedes copiar la tabla de AdminCitas y adaptarla aquí:
function TablaCitas({ citas }) {
    return (
        <table style={{ width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
                <tr style={{ background: "#20232b" }}>
                    <th style={{ padding: 12, textAlign: "left" }}>Fecha y hora</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Servicio</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Notas</th>
                </tr>
            </thead>
            <tbody>
                {citas.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>No hay citas</td>
                    </tr>
                ) : (
                    citas.map(c => (
                        <tr key={c.id} style={{ borderBottom: "1px solid #222" }}>
                            <td style={{ padding: 10 }}>{c.fechaHora?.replace("T", " ").slice(0, 16)}</td>
                            <td style={{ padding: 10 }}>{c.servicio}</td>
                            <td style={{ padding: 10, textAlign: "center" }}>{c.estado}</td>
                            <td style={{ padding: 10 }}>{c.notas}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

function TablaTalleres({ talleres }) {
    return (
        <table style={{ width: "100%", background: "#23272f", borderCollapse: "collapse", color: "#fff" }}>
            <thead>
                <tr style={{ background: "#20232b" }}>
                    <th style={{ padding: 12, textAlign: "left" }}>Fecha y hora</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Taller</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Estado</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Notas</th>
                </tr>
            </thead>
            <tbody>
                {talleres.length === 0 ? (
                    <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>No hay talleres</td>
                    </tr>
                ) : (
                    talleres.map(t => (
                        <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
                            <td style={{ padding: 10 }}>{t.fechaHora?.replace("T", " ").slice(0, 16)}</td>
                            <td style={{ padding: 10 }}>{t.nombre}</td>
                            <td style={{ padding: 10, textAlign: "center" }}>{t.estado}</td>
                            <td style={{ padding: 10 }}>{t.notas}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
