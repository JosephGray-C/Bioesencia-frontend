import { useEffect, useState } from "react";

export function useHorarios(selectedDate) {
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {

    if (!selectedDate) return;

    const fechaStr = selectedDate.getFullYear() + "-" +
      String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" +
      String(selectedDate.getDate()).padStart(2, "0");

    console.log("Consultando horarios para:", fechaStr);

    fetch(`http://localhost:8080/api/citas/horariosDisponibles?fecha=${fechaStr}`)
      .then(res => res.json())
      .then(setHorarios);
  }, [selectedDate]); 

  return [horarios, setHorarios];
}