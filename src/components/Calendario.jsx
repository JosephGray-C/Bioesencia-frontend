import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useUser } from "../context/UserContext";
import { convertDateToTimeAmPm, dateFormat } from "../utils/formatDateTime.js";
import { inscripcionesAgendadas } from "../services/inscripciones.js";
import { citasAgendadas } from "../services/citas.js";
import ClipLoader from "react-spinners/ClipLoader";

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("citas");
    const [citas, setCitas] = useState([]);
    const [talleres, setTalleres] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const uid = user?.id;
        if (!uid) return;

        setIsLoading(true);
        if (activeTab === "citas") {
            citasAgendadas(dateFormat(selectedDate), uid)
                .then(setCitas)
                .catch(() => setCitas([]))
                .finally(() => setIsLoading(false));
        } else {
            inscripcionesAgendadas(dateFormat(selectedDate), uid)
                .then(setTalleres)
                .catch(() => setTalleres([]))
                .finally(() => setIsLoading(false));
        }
    }, [selectedDate, activeTab, user?.id]);

    return (
        <section className="calpage">
            <header className="bu-hero">
                <div
                    className="bu-hero-inner"
                    style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}
                >
                    <p className="bu-hero-subtitle ">
                        Consulta tus citas y talleres agendados en{" "}
                        <strong>Bioesencia</strong>.
                    </p>
                </div>
            </header>
            <div className="calgrid">
                <div className="left">
                    <Calendar
                        setSelectedDate={setSelectedDate}
                        selectedDate={selectedDate}
                        comp="calendario"
                    />
                </div>
                <div className="right">
                    <div className="tabs">
                        <button
                            className={`tabbtn ${
                                activeTab === "citas" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("citas")}
                        >
                            Citas
                        </button>
                        <button
                            className={`tabbtn ${
                                activeTab === "talleres" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("talleres")}
                        >
                            Talleres
                        </button>
                    </div>
                    <div className="home-crud">
                        {activeTab === "citas" ? (
                            <TablaCitas citas={citas} isLoading={isLoading} />
                        ) : (
                            <TablaTalleres
                                talleres={talleres}
                                isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TablaCitas({ citas, isLoading }) {
    if (!citas) citas = [];
    const showSpinner = isLoading && citas.length === 0;

    return (
        <>
            <table
                style={{
                    width: "100%",
                    background: "#fff",
                    borderCollapse: "collapse",
                    color: "#000000",
                    fontSize: "clamp(12px, 2vw, 14px)", // Responsive font size
                }}
            >
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "80px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Servicio
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "80px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Fecha
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "60px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Hora
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "70px",
                                textAlign: "center",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Estado
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "80px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Notas
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {citas.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                style={{ textAlign: "center", padding: 20 }}
                            >
                                {showSpinner ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ClipLoader
                                            size={18}
                                            color="#bbb"
                                            speedMultiplier={0.9}
                                        />
                                    </span>
                                ) : (
                                    "No hay citas"
                                )}
                            </td>
                        </tr>
                    ) : (
                        citas.map((c) => {
                            let fecha = "";
                            let hora = "";
                            if (c.fechaHora) {
                                const [f] = c.fechaHora
                                    .replace("T", " ")
                                    .split(" ");
                                fecha = f;
                                hora = convertDateToTimeAmPm(c.fechaHora);
                            }
                            return (
                                <tr
                                    key={c.id}
                                    style={{ borderBottom: "1px solid #222" }}
                                >
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                            maxWidth: "120px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={c.servicio}
                                    >
                                        {c.servicio}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {fecha}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {hora}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {c.estado}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                            maxWidth: "100px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={c.notas || "—"}
                                    >
                                        {c.notas || "—"}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* FOOTER */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span
                    style={{
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                        fontSize: "clamp(12px, 2vw, 14px)",
                    }}
                >
                    Mostrando {citas.length} citas
                </span>
            </div>
        </>
    );
}

function TablaTalleres({ talleres, isLoading }) {
    if (!talleres) talleres = [];
    const showSpinner = isLoading && talleres.length === 0;

    return (
        <>
            <table
                style={{
                    width: "100%",
                    background: "#fff",
                    borderCollapse: "collapse",
                    color: "#000000",
                    fontSize: "clamp(12px, 2vw, 14px)", // Responsive font size
                }}
            >
                <thead>
                    <tr style={{ background: "#A9C499", color: "#fff" }}>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "70px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Título
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "60px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Lugar
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "50px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Inicio
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "50px",
                                textAlign: "left",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Fin
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "40px",
                                textAlign: "center",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Cupo
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "60px",
                                textAlign: "center",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Precio
                        </th>
                        <th
                            style={{
                                padding: "clamp(8px, 1.5vw, 12px)",
                                minWidth: "50px",
                                textAlign: "center",
                                fontSize: "clamp(11px, 1.8vw, 13px)",
                            }}
                        >
                            Activo
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {talleres.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                style={{ textAlign: "center", padding: 20 }}
                            >
                                {showSpinner ? (
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <ClipLoader
                                            size={18}
                                            color="#bbb"
                                            speedMultiplier={0.9}
                                        />
                                    </span>
                                ) : (
                                    "No hay talleres"
                                )}
                            </td>
                        </tr>
                    ) : (
                        talleres.map((t) => {
                            let horaInicio = "";
                            let horaFin = "";
                            if (t.fechaInicio) {
                                horaInicio = convertDateToTimeAmPm(
                                    t.fechaInicio
                                );
                            }
                            if (t.fechaFin) {
                                horaFin = convertDateToTimeAmPm(t.fechaFin);
                            }
                            return (
                                <tr
                                    key={t.id}
                                    style={{ borderBottom: "1px solid #222" }}
                                >
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                            maxWidth: "100px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={t.titulo}
                                    >
                                        {t.titulo}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                            maxWidth: "80px",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}
                                        title={t.lugar}
                                    >
                                        {t.lugar}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {horaInicio}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "left",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {horaFin}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {t.cupoMaximo}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {t.precio?.toLocaleString("es-CR", {
                                            style: "currency",
                                            currency: "CRC",
                                        })}
                                    </td>
                                    <td
                                        style={{
                                            padding: "clamp(6px, 1.2vw, 10px)",
                                            textAlign: "center",
                                            verticalAlign: "middle",
                                        }}
                                    >
                                        {t.activo ? "Sí" : "No"}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            {/* FOOTER */}
            <div style={{ width: "100%", marginTop: 20 }}>
                <span
                    style={{
                        color: "#000000",
                        display: "block",
                        marginBottom: 8,
                        textAlign: "center",
                        fontSize: "clamp(12px, 2vw, 14px)",
                    }}
                >
                    Mostrando {talleres.length} talleres
                </span>
            </div>
        </>
    );
}
