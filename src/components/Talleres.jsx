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
            <header className="bu-hero">
                <div className="bu-hero-inner">
                    <p className="bu-hero-subtitle">
                        Descubre y participa en los talleres de{" "}
                        <strong>Bioesencia</strong> para tu bienestar.
                    </p>
                </div>
            </header>

            <section>
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
                            "No hay talleres disponibles en este momento."
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
            </section>
        </div>
    );
}
