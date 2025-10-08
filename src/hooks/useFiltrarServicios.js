import { useState, useMemo } from "react";

export default function useFiltrarServicios(servicios) {
    const [busqueda, setBusqueda] = useState("");

    // Filtro de búsqueda
    const listaFiltrada = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return servicios;
        return servicios.filter(
            (s) =>
                (s.nombre || "").toLowerCase().includes(q) ||
                (s.detalle || "").toLowerCase().includes(q)
        );
    }, [busqueda, servicios]);

    return { listaFiltrada, busqueda, setBusqueda };
}
