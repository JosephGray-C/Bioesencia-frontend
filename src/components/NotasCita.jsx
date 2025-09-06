export default function NotasCita({ cita, setCita }) {
    return (
        <div className="notas-cita-container">
            <style>{styles}</style>
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

const styles = `
    .notas-cita-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }
    .notas-cita-label {
        font-size: 1.1rem;
        font-weight: 600;
        color: #23272f;
    }
    .notas-cita-textarea {
        width: 100%;
        min-height: 280px;
        max-height: 300px;
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #e3e4e8;
        font-size: 1rem;
        resize: vertical;
        background: #f6f7f8;
        box-sizing: border-box;
        transition: border-color .15s;
    }
    .notas-cita-textarea:focus {
        border-color: #A9C499;
        outline: none;
        background: #eef6ee;
    }
`;
