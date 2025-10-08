import { useState, useMemo } from "react";

export default function useFiltrarInscripciones(inscripciones) {
    const [busqueda, setBusqueda] = useState("");

    // Filtrado de búsqueda
    const listaFiltrada = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return inscripciones;
        return inscripciones.filter(
            (i) => 
                (i.tallerNombre || "").toLowerCase().includes(q) ||
                (i.usuarioNombre || "").toLowerCase().includes(q) ||
                (i.usuarioApellido || "").toLowerCase().includes(q) ||
                (i.usuarioEmail || "").toLowerCase().includes(q) ||
                (i.estado || "").toLowerCase().includes(q)
        );
    }, [busqueda, inscripciones]);
    return { listaFiltrada, busqueda, setBusqueda };
}