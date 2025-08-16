import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useUser } from "../context/UserContext";

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("citas");
    const [citas, setCitas] = useState([]);
    const [talleres, setTalleres] = useState([])
    const {user} = useUser();

    useEffect(() => {
        if (!user?.id) return; // Solo ejecuta si user.id existe
        const fechaStr = selectedDate.getFullYear() + "-" +
          String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
          String(selectedDate.getDate()).padStart(2, "0");
        console.log(fechaStr);
        console.log(user.id)
        if (activeTab === "citas") {
            fetch(`http://localhost:8080/api/citas/agendadas/${fechaStr}/${user.id}`)
            .then(res => res.json())
            .then(setCitas);
        } else {
            fetch(`http://localhost:8080/api/inscripciones/agendadas/${fechaStr}/${user.id}`)
            .then(res => res.json())
            .then(setTalleres);
        } 
    }, [selectedDate, activeTab, user.id]);

    return (
        <div style={{
            width: "100%",
            maxWidth: 800,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Calendar
                setSelectedDate={setSelectedDate}
                selectedDate={selectedDate}
                comp="calendario"
            />

            {/* Tabs */}
            <div style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start", // <-- changed from "center"
                gap: 12,
                marginBottom: 18,
                position: "relative",
                zIndex: 2,
                paddingTop: 20,
            }}>

                <button
                    onClick={() => setActiveTab("citas")}
                    style={{
                        padding: "8px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: activeTab === "citas" ? "#5EA743" : "#23272f",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 15,
                        transition: "background 0.2s"
                    }}
                >
                    Citas
                </button>

                <button
                    onClick={() => setActiveTab("talleres")}
                    style={{
                        padding: "8px 24px",
                        borderRadius: 8,
                        border: "none",
                        background: activeTab === "talleres" ? "#5EA743" : "#23272f",
                        color: "#fff",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: 15,
                        transition: "background 0.2s"
                    }}
                >
                    Talleres
                </button>

            </div>

            {/* Table */}
            <div style={{ width: "100%" }}>
                {activeTab === "citas" ? (
                    <TablaCitas citas={citas} />
                ) : (
                    <TablaTalleres talleres={talleres} />
                )}
            </div>
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
                    <th style={{ padding: 12, textAlign: "left" }}>Título</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Fecha inicio</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Fecha fin</th>
                    <th style={{ padding: 12, textAlign: "left" }}>Lugar</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Cupo</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Precio</th>
                    <th style={{ padding: 12, textAlign: "center" }}>Activo</th>
                </tr>
            </thead>
            <tbody>
                {talleres.length === 0 ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>No hay talleres</td>
                    </tr>
                ) : (
                    talleres.map(t => (
                        <tr key={t.id} style={{ borderBottom: "1px solid #222" }}>
                            <td style={{ padding: 10 }}>{t.titulo}</td>
                            <td style={{ padding: 10 }}>{t.fechaInicio?.replace("T", " ").slice(0, 16)}</td>
                            <td style={{ padding: 10 }}>{t.fechaFin?.replace("T", " ").slice(0, 16)}</td>
                            <td style={{ padding: 10 }}>{t.lugar}</td>
                            <td style={{ padding: 10, textAlign: "center" }}>{t.cupoMaximo}</td>
                            <td style={{ padding: 10, textAlign: "center" }}>
                                {t.precio?.toLocaleString("es-CR", { style: "currency", currency: "CRC" })}
                            </td>
                            <td style={{ padding: 10, textAlign: "center" }}>
                                {t.activo ? "Sí" : "No"}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}