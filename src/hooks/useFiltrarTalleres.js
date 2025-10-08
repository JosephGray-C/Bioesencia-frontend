import { useState, useMemo } from 'react';

export default function useFiltrarTalleres(talleres) {
    const [busqueda, setBusqueda] = useState("");

    const listaFiltrada = useMemo(
        () =>
            (talleres || []).filter((t) => {
                const q = busqueda.trim().toLowerCase();
                if (!q) return true;
                return (
                    (t.titulo || "").toLowerCase().includes(q) ||
                    (t.descripcion || "").toLowerCase().includes(q) ||
                    (t.lugar || "").toLowerCase().includes(q) ||
                    (t.fechaInicio || "").toLowerCase().includes(q) ||
                    (t.fechaFin || "").toLowerCase().includes(q) ||
                    (t.cupoMaximo?.toString() || "").toLowerCase().includes(q) ||
                    (t.precio?.toString() || "").toLowerCase().includes(q) ||
                    (t.activo ? "sí" : "no").includes(q)
                );
            }),
        [talleres, busqueda]
    );

    return { busqueda, setBusqueda, listaFiltrada };
}
