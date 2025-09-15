import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { useUser } from "../context/UserContext";
import { convertDateToTimeAmPm } from "../utils/formatDateTime.js";

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeTab, setActiveTab] = useState("citas");
    const [citas, setCitas] = useState([]);
    const [talleres, setTalleres] = useState([]);
    const { user } = useUser();

    useEffect(() => {
        const uid = user?.id;
        if (!uid) return;

        const fechaStr =
            selectedDate.getFullYear() +
            "-" +
            String(selectedDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(selectedDate.getDate()).padStart(2, "0");

        if (activeTab === "citas") {
            fetch(
                `http://localhost:8080/api/citas/agendadas/${fechaStr}/${uid}`
            )
                .then((res) => res.json())
                .then(setCitas)
                .catch(() => setCitas([]));
        } else {
            fetch(
                `http://localhost:8080/api/inscripciones/agendadas/${fechaStr}/${uid}`
            )
                .then((res) => res.json())
                .then(setTalleres)
                .catch(() => setTalleres([]));
        }
    }, [selectedDate, activeTab, user?.id]);

    return (
        <section className="calpage">
            <header className="bu-hero">
                <div
                    className="bu-hero-inner"
                    style={{ maxWidth: 900, margin: "0 auto", width: "100%" }}
                >
                    <p className="bu-hero-subtitle bu-hero-subtitle--spaced">
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
                <div className="right card">
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
                    <div className="tablewrap">
                        {activeTab === "citas" ? (
                            <TablaCitas citas={citas} />
                        ) : (
                            <TablaTalleres talleres={talleres} />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TablaCitas({ citas }) {
    if (!citas) citas = [];
    return (
        <table className="bu-table">
            <thead>
                <tr>
                    <th>Servicio</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                    <th>Notas</th>
                </tr>
            </thead>
            <tbody>
                {citas.length === 0 ? (
                    <tr>
                        <td
                            colSpan={5}
                            className="center"
                            style={{ padding: 32 }}
                        >
                            <span className="bu-empty-row">No hay citas</span>
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
                            <tr key={c.id}>
                                <td>
                                    <span className="bu-servicio">
                                        {c.servicio}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-fecha">{fecha}</span>
                                </td>
                                <td>
                                    <span className="bu-hora">{hora}</span>
                                </td>
                                <td>
                                    <span
                                        className={`bu-estado bu-estado--${c.estado?.toLowerCase()}`}
                                    >
                                        {c.estado}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-notas">
                                        {c.notas || "—"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}

function TablaTalleres({ talleres }) {
    if (!talleres) talleres = [];
    return (
        <table className="bu-table">
            <thead>
                <tr>
                    <th>Título</th>
                    <th>Lugar</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th className="center">Cupo</th>
                    <th className="center">Precio</th>
                    <th className="center">Activo</th>
                </tr>
            </thead>
            <tbody>
                {talleres.length === 0 ? (
                    <tr>
                        <td
                            colSpan={7}
                            className="center"
                            style={{ padding: 32 }}
                        >
                            <span className="bu-empty-row">
                                No hay talleres
                            </span>
                        </td>
                    </tr>
                ) : (
                    talleres.map((t) => {
                        let horaInicio = "";
                        let horaFin = "";
                        if (t.fechaInicio) {
                            horaInicio = convertDateToTimeAmPm(t.fechaInicio);
                        }
                        if (t.fechaFin) {
                            horaFin = convertDateToTimeAmPm(t.fechaFin);
                        }
                        return (
                            <tr key={t.id}>
                                <td>
                                    <span className="bu-titulo">
                                        {t.titulo}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-lugar">{t.lugar}</span>
                                </td>
                                <td>
                                    <span className="bu-hora">
                                        {horaInicio}
                                    </span>
                                </td>
                                <td>
                                    <span className="bu-hora">{horaFin}</span>
                                </td>
                                <td className="center">
                                    <span className="bu-cupo">
                                        {t.cupoMaximo}
                                    </span>
                                </td>
                                <td className="center">
                                    <span className="bu-precio">
                                        {t.precio?.toLocaleString("es-CR", {
                                            style: "currency",
                                            currency: "CRC",
                                        })}
                                    </span>
                                </td>
                                <td className="center">
                                    <span
                                        className={`bu-activo bu-activo--${
                                            t.activo ? "si" : "no"
                                        }`}
                                    >
                                        {t.activo ? "Sí" : "No"}
                                    </span>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
    );
}