import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";
import ServiciosList from "./ServiciosCita";
import HorariosList from "./HorariosCita";
import NotasCita from "./NotasCita";
import ConfirmarCita from "./ConfirmarCita";
import { crearCita } from "../services/citas";
import Loading from "./Loading";

export default function FormCita({ selectedDate }) {
    const [step, setStep] = useState(0);
    const { user } = useUser();
    const qc = useQueryClient();

    const [cita, setCita] = useState({
        usuario: user || null,
        duracion: 60,
        estado: "AGENDADA",
        servicio: null,
        fechaHora: null,
        notas: "",
    });

    useEffect(() => {
        console.log(cita);
    }, [cita]);

    const limpiarCita = () => {
        setCita({
            usuario: user || null,
            duracion: 60,
            estado: "AGENDADA",
            servicio: null,
            fechaHora: null,
            notas: "",
        });
        setStep(0);
    };

    const mCrear = useMutation({
        mutationFn: crearCita,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["citas"] });
            limpiarCita();
            Swal.fire(
                "Cita agendada",
                "Tu cita ha sido agendada con éxito.",
                "success"
            );
        },
        onError: (error) => {
            console.log(error);
            Swal.fire("Error", `No se pudo agendar la cita`, "error");
        },
    });

    const handleAgendar = () => {
        if (!cita.servicio && !cita.fechaHora) {
            Swal.fire(
                "Servicio y hora no seleccionados",
                "Por favor selecciona un servicio y una hora.",
                "warning"
            );
            setStep(0);
            return;
        } else if (!cita.servicio) {
            Swal.fire(
                "Servicio no seleccionado",
                "Por favor selecciona un servicio.",
                "warning"
            );
            setStep(0);
            return;
        } else if (!cita.fechaHora) {
            Swal.fire(
                "Hora no seleccionada",
                "Por favor selecciona una hora.",
                "warning"
            );
            setStep(1);
            return;
        }
        mCrear.mutate(cita);
    };

    const renderContent = () => {
        switch (step) {
            case 0:
                return <ServiciosList cita={cita} setCita={setCita} />;
            case 1:
                return (
                    <HorariosList
                        selectedDate={selectedDate}
                        cita={cita}
                        setCita={setCita}
                    />
                );
            case 2:
                return <NotasCita cita={cita} setCita={setCita} />;
            case 3:
                return <ConfirmarCita cita={cita} />;
            default:
                return null;
        }
    };

    const renderFooter = () => (
        <div className="agendar-form-footer-fixed">
            {step === 3 && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        type="button"
                        className="agendar-btn"
                        onClick={() => handleAgendar()}
                    >
                        Agendar
                    </button>
                    {mCrear.isPending && (
                        <Loading message="Agendando cita" />
                    )}
                </div>
            )}
            <div style={{ flex: 1 }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {step > 0 && (
                    <button
                        type="button"
                        className="agendar-btn"
                        onClick={() => setStep(step - 1)}
                        aria-label="Anterior"
                    >
                        &#8592;
                    </button>
                )}
                <button
                    type="button"
                    className="agendar-btn"
                    onClick={() => setStep(step + 1)}
                    aria-label="Siguiente"
                    style={{ visibility: step < 3 ? "visible" : "hidden" }}
                >
                    &#8594;
                </button>
            </div>
        </div>
    );

    return (
        <div className="card-pad">
            <div className="agendar-form-content">{renderContent()}</div>
            {renderFooter()}
        </div>
    );
}
