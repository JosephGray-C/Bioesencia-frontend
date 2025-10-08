import { useState, useMemo } from "react";

export default function useFiltrarOrdenes(ordenes) {
    const [busqueda, setBusqueda] = useState("");

    // Filtrado de búsqueda
    const listaFiltrada = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return ordenes;
        return ordenes.filter(
            (ord) =>
                (ord.codigoOrden || "").toLowerCase().includes(q) ||
                (ord.usuarioNombre || "").toLowerCase().includes(q) ||
                (ord.estado || "").toLowerCase().includes(q) ||
                (ord.total?.toString() || "").toLowerCase().includes(q) ||
                (ord.fechaOrden || "").toLowerCase().includes(q)
        );
    }, [ordenes, busqueda]);

    return { listaFiltrada, busqueda, setBusqueda };
}
