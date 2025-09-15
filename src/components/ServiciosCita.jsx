import React from "react";
import { fetchServicios } from "../services/servicios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function ServiciosList({ cita, setCita }) {
    const qc = useQueryClient();

    const {
        data: servicios = [],
        isFetching,
        error,
    } = useQuery({
        queryKey: ["servicios"],
        queryFn: fetchServicios,
        initialData: () => qc.getQueryData(["servicios"]) || [],
    });

    const showSpinner = isFetching && servicios.length === 0;
    if (error) return <p>Error al cargar los servicios: {error.message}</p>;
    if (showSpinner) return <p>Cargando servicios...</p>;
    if (servicios.length === 0) return <p>No hay servicios disponibles.</p>;

    const servicioSeleccionado =
        servicios.find((s) => s.nombre === cita.servicio)?.id || "";

    return (
        <div>
            <h3>Servicios</h3>
            {showSpinner ? (
                <p>Cargando servicios...</p>
            ) : (
                <div className="servicios-list">
                    {servicios.map((servicio) => (
                        <div
                            className={`servicio-card${
                                servicio.id === servicioSeleccionado
                                    ? " selected"
                                    : ""
                            }`}
                            key={servicio.id}
                            onClick={() =>
                                setCita((prev) => ({
                                    ...prev,
                                    servicio: servicio.nombre,
                                }))
                            }
                        >
                            {servicio.nombre}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}