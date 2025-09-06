import React from "react";
import { fetchServicios } from "../services/servicios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ServiciosList({cita, setCita}) {
    const [servicioSeleccionado, setServicioSeleccionado] = React.useState("");
    const qc = useQueryClient();

    const { data: servicios = [], isFetching, error } = useQuery({
        queryKey: ["servicios"],
        queryFn: fetchServicios,
        initialData: () => qc.getQueryData(["servicios"]) || [],
    });

    const showSpinner = isFetching && servicios.length === 0;
    if (error) return <p>Error al cargar los servicios: {error.message}</p>;
    if (showSpinner) return <p>Cargando servicios...</p>;
    if (servicios.length === 0) return <p>No hay servicios disponibles.</p>;

    return (
        <div>
            <style>{`
            ${styles}
            `}</style>
            <h3>Servicios</h3>
            {showSpinner ? (
                <p>Cargando servicios...</p>
            ) : (
                <div className="servicios-list">
                    {servicios.map((servicio) => (
                        <div
                            className={`servicio-card${
                                servicio.id === servicioSeleccionado || (servicio === cita.servicio)
                                    ? " selected"
                                    : ""
                            }`}
                            key={servicio.id}
                            onClick={() => setServicioSeleccionado(servicio.id) || setCita((prev) => ({...prev, servicio: servicio})) }
                        >
                            {servicio.nombre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = `
    .servicios-list {
        display: flex;
        flex-direction: column;
        gap: 14px;
        align-items: center;
        margin-top: 18px;
        width: 100%;
    }
    .servicio-card {
        background: #f6f7f8;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,.07);
        padding: 16px 28px;
        width: 100%;
        min-width: 0;
        max-width: 100%;
        text-align: center;
        font-size: 1.08rem;
        color: #23272f;
        font-weight: 600;
        margin: 0;
        transition: box-shadow .15s;
        box-sizing: border-box;
    }
    .servicio-card:hover {
        box-shadow: 0 6px 18px rgba(0,0,0,.13);
    }
    .servicio-card.selected {
        border: 2px solid #A9C499;
        background: #e6f7e6;
    }

`;
