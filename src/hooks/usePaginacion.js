import { useState } from "react";
export default function usePaginacion(listaFiltrada){
    const [paginaActual, setPaginaActual] = useState(1);

    const porPagina = 8;
    const totalPaginas = Math.ceil(listaFiltrada.length / porPagina) || 1;
    const paginaSegura = Math.min(paginaActual, totalPaginas);
    const indice = (paginaSegura - 1) * porPagina;
    const pagina = listaFiltrada.slice(indice, indice + porPagina);

    return {pagina,totalPaginas, paginaActual, setPaginaActual};
}