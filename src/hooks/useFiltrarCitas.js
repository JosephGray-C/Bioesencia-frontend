import { useState, useMemo } from "react";

export default function useFiltrarCitas(citas) {
    const [busqueda, setBusqueda] = useState("");

    // Filtrado
    const listaFiltrada = useMemo(() => {
        const q = busqueda.toLowerCase();
        if (!q) return citas;
        return citas.filter(
            (c) =>
                c.fechaHora?.toLowerCase().includes(q) ||
                c.servicio?.toLowerCase().includes(q) ||
                c.usuarioNombre?.toLowerCase().includes(q) ||
                c.usuarioCorreo?.toLowerCase().includes(q) ||
                c.estado?.toLowerCase().includes(q) ||
                c.notas?.toLowerCase().includes(q)
        );
    }, [citas, busqueda]);

    return { listaFiltrada, busqueda, setBusqueda };
}