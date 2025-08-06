import { useState, useEffect } from "react";

export function useHorarios(selectedDate) {
    const [horariosDisponibles, setHorariosDisponibles] = useState([]);
    useEffect(() => {
        if (selectedDate) {
            const fechaStr = selectedDate.toISOString().split("T")[0];
            fetch(`http://localhost:8080/api/citas/horariosDisponibles?fecha=${fechaStr}`)
            .then(res => res.json())
            .then(data => setHorariosDisponibles(data));
        }
    }, [selectedDate]);
    
    return [horariosDisponibles, setHorariosDisponibles];
}