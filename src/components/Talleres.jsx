import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTalleres } from "../services/talleres";
import TallerModal from "./TallerModal";
import Taller from "./Taller";

export default function Talleres() {
    const qc = useQueryClient();
    const [selectedTaller, setSelectedTaller] = useState(null);

    const {
        data: talleres = [],
        isFetching,
        error,
    } = useQuery({
        queryKey: ["talleres"],
        queryFn: fetchTalleres,
        initialData: () => qc.getQueryData(["talleres"]) || [],
    });

    const showSpinner = isFetching && talleres.length === 0;

    if (error) {
        return (
            <div className="tp-error">
                ⚠️ No se pudieron cargar los talleres.
            </div>
        );
    }

    return (
        <div className="tp">
            <style>{styles}</style>
            <header className="tp-hero">
                <div className="tp-hero-inner">
                    <p className="tp-subtitle">
                        Descubre y participa en los talleres de{" "}
                        <strong>Bioesencia</strong> para tu bienestar.
                    </p>
                </div>
            </header>
            {talleres.length === 0 ? (
                <div className="tp-empty">
                    {showSpinner ? (
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <ClipLoader
                                size={22}
                                color="var(--green)"
                                speedMultiplier={0.9}
                            />
                            <span>Cargando talleres…</span>
                        </span>
                    ) : (
                        <p>No hay talleres disponibles en este momento.</p>
                    )}
                </div>
            ) : (
                <ul className="tp-grid">
                    {talleres.map((taller) => (
                        <Taller
                            taller={taller}
                            selectedTaller={selectedTaller}
                            setSelectedTaller={setSelectedTaller}
                            key={taller.id}
                        />
                    ))}
                </ul>
            )}
            {selectedTaller && (
                <div className="modal-overlay">
                    <TallerModal
                        tallerSelected={selectedTaller}
                        onClose={() => setSelectedTaller(null)}
                    />
                </div>
            )}
        </div>
    );
}

const styles = `
:root{
  --wine:#5A0D0D;
  --green:#A9C499;
  --border:#e5e7eb;
  --text:#1f2937;
}

.tp {
    width: 100%;
    min-height: 100vh;
    padding: 24px 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
@media (min-width:640px){.tp{padding:32px 20px;}}
@media (min-width:1024px){.tp{padding:40px 24px;}}

.tp-hero {
    width: 100%;
    max-width: 900px;
    margin: 0 auto 18px auto;
    padding: 18px 0 10px 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
}
.tp-hero-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
    width: 100%;
}
.tp-title {
  margin: 0 0 8px 0;
  color: var(--wine);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 800;
  letter-spacing: .2px;
}
.tp-subtitle {
    margin: 0;
    color: #41503a;
    font-size: clamp(15px, 2vw, 18px);
    line-height: 1.7;
    margin-top: 10px;
    margin-bottom: 18px;
    padding-top: 6px;
    padding-bottom: 6px;
    display: block;
}

.tp-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wine);
}
.tp-error {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  background: #fff0f0;
  color: var(--wine);
  border: 2px solid var(--wine);
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
}


.tp-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 16px;
  background: #A9C499;
  color: #5A0D0D;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 800;
  text-align: center;
  transition: transform .15s, filter .15s;
  align-self: flex-end;
}
.tp-btn:hover {
  filter: brightness(.96);
  transform: translateY(-1px);
}
@media (max-width:480px){ .tp-btn{display:block;width:100%;} }

.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(60,60,60,0.18);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.tp-modal-overlay,
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(60,60,60,0.18);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
.taller-modal-card,
.modal-content {
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 16px 40px rgba(0,0,0,.18);
    padding: 0;
    width: 480px;
    min-width: 320px;
    max-width: 480px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: modalIn .22s cubic-bezier(.6,.2,.4,1);
}
@keyframes modalIn {
    from { opacity: 0; transform: translateY(30px) scale(.97);}
    to { opacity: 1; transform: translateY(0) scale(1);}
}
@media (max-width:700px){
    .taller-modal-card,
    .modal-content {
        border-radius: 14px;
        max-width: 99vw;
        width: 99vw;
    }
}
@media (max-width:480px){
    .taller-modal-card,
    .modal-content {
        max-width: 100vw;
        width: 100vw;
        border-radius: 8px;
    }
}
`;
