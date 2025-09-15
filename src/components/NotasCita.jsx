export default function NotasCita({ cita, setCita }) {
    return (
        <div className="notas-cita-container">
            <label className="notas-cita-label" htmlFor="notas-cita-textarea">
                Notas para la cita
            </label>
            <textarea
                id="notas-cita-textarea"
                className="notas-cita-textarea"
                value={cita.notas || ""}
                onChange={(e) =>
                    setCita((prev) => ({ ...prev, notas: e.target.value }))
                }
                placeholder="Escribe tus notas aquí..."
            />
        </div>
    );
}