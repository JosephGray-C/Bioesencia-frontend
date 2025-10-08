import { useState, useMemo } from "react";

export default function useFiltrarProductos(productos) {
    const [busqueda, setBusqueda] = useState("");

    // Filtro de búsqueda
    const listaFiltrada = useMemo(() => {
        const q = busqueda.trim().toLowerCase();
        if (!q) return productos;
        return productos.filter(
            (p) =>
                (p.nombre || "").toLowerCase().includes(q)
        );
    }, [busqueda, productos]);

    return { listaFiltrada, busqueda, setBusqueda };
}