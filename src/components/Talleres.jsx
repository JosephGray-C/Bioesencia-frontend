import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTalleres } from "../services/talleres";
import TallerModal from "./TallerModal";
import Taller from "./Taller";
import Loading from "./Loading";

export default function Talleres() {
    const qc = useQueryClient();
    const [selectedTaller, setSelectedTaller] = useState(null);

    const {
        data: talleres = [],
        isFetching,
    } = useQuery({
        queryKey: ["talleres"],
        queryFn: fetchTalleres,
        initialData: () => qc.getQueryData(["talleres"]) || [],
    });

    const showSpinner = isFetching && talleres.length === 0;


    return (
        <div className="list-page">

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
                    <div
                        className="empty"
                        style={{
                            gridColumn: "1 / -1",
                            minHeight: 180,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {showSpinner ? (
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                               <Loading message="Cargando talleres" />
                            </span>
                        ) : (
                            "No hay talleres disponibles en este momento."
                        )}
                    </div>
                ) : (
                    <ul className="list-grid">
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
            </section>

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
