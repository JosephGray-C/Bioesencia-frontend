import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUser } from "../context/UserContext";
import ServiciosList from "./ServiciosCita";
import HorariosList from "./HorariosCita";
import NotasCita from "./NotasCita";
import ConfirmarCita from "./ConfirmarCita";
import { crearCita } from "../services/citas";

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
                    {mCrear.isPending && <p>Procesando...</p>}
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
            <style>{styles}</style>
            <div className="agendar-form-content">{renderContent()}</div>
            {renderFooter()}
        </div>
    );
}

const styles = `
.card-pad {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 22px rgba(0,0,0,.07);
  display: flex;
  flex-direction: column;
  width: 470px;         
  min-width: 420px;
  max-width: 100%;
  height: 370px;       
  min-height: 430px;
  max-height: 80vh;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  transition: width 0.2s, height 0.2s;
}
.agendar-form-content {
  flex: 1 1 auto;
  padding: 18px 24px 80px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
.agendar-form-footer-fixed {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 10px 24px 16px 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 0 0 16px 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 48px;
  z-index: 2;
}
.agendar-btn {
  background: #A9C499;
  color: #5A0D0D;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background .15s, transform .15s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
}
.agendar-btn:hover {
  background: #8aa37c;
  transform: translateY(-1px);
}
@media (max-width: 900px) {
  .card-pad {
    width: 100%;
    min-height: 433px;
    border-radius: 10px;
  }
  .agendar-form-content {
    max-height: 433px;
    padding: 14px 12px 70px 12px;
    gap: 14px;
  }
  .agendar-form-footer-fixed {
    padding: 10px 12px 14px 12px;
    min-height: 40px;
    border-radius: 0 0 10px 10px;
  }
}
@media (max-width: 700px) {
  .card-pad {
    width: 100%;
    min-height: 420px;
    border-radius: 8px;
  }
  .agendar-form-content {
    max-height: 420px;
    padding: 10px 6vw 60px 6vw;
    gap: 10px;
  }
  .agendar-form-footer-fixed {
    padding: 8px 6vw 12px 6vw;
    min-height: 36px;
    border-radius: 0 0 8px 8px;
  }
}
@media (max-width: 480px) {
  .agendar-form-content {
    padding: 8px 2vw 56px 2vw;
    gap: 8px;
  }
  .agendar-form-footer-fixed {
    padding: 8px 2vw 10px 2vw;
  }
}
`;
