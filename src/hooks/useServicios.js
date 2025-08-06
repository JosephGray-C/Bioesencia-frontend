import { useState, useEffect } from "react";

export function useServicios() {
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/servicios")
            .then(res => res.json())
            .then(data => setServiciosDisponibles(data));
    }, []);

    return serviciosDisponibles;
}
