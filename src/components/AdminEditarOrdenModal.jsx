export default function AdminEditarOrdenModal({ editForm, onChange, onSubmit, onCancel }) {
    const ESTADOS_POSIBLES = ["PENDIENTE", "PAGADO", "ANULADO"];
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: 520,
                    width: "100%",
                    position: "relative",
                    boxShadow: "0 8px 32px #0004",
                }}
            >
                <div className="forms" style={{ background: "#fff" }}>
                    <div className="form-content">
                        <div className="signup-form" style={{ width: "100%" }}>
                            <div
                                className="title"
                                style={{
                                    fontWeight: 600,
                                    fontSize: 26,
                                    marginBottom: 12,
                                    color: "#5EA743",
                                }}
                            >
                                Editar orden
                            </div>
                            <form onSubmit={onSubmit}>
                                <div
                                    className="input-boxes"
                                    style={{ marginTop: 18 }}
                                >
                                    <div className="input-box">
                                        <i className="fas fa-hashtag"></i>
                                        <input
                                            type="text"
                                            name="codigoOrden"
                                            value={editForm.codigoOrden}
                                            readOnly
                                        />
                                    </div>

                                    <div
                                        className="input-box"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                        }}
                                    >
                                        <label
                                            style={{
                                                minWidth: 90,
                                                color: "#5A0D0D",
                                            }}
                                        >
                                            <strong>Estado:</strong>
                                        </label>
                                        <select
                                            name="estado"
                                            value={editForm.estado}
                                            onChange={onChange}
                                            style={{
                                                flex: 1,
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: "1px solid #ccc",
                                                fontSize: 16,
                                            }}
                                        >
                                            {ESTADOS_POSIBLES.map((op) => (
                                                <option key={op} value={op}>
                                                    {op}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div
                                        className="button input-box"
                                        style={{ marginTop: 26 }}
                                    >
                                        <input
                                            type="submit"
                                            value="Guardar cambios"
                                        />
                                    </div>
                                    <div
                                        style={{
                                            marginTop: 8,
                                            textAlign: "right",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={onCancel}
                                            style={{
                                                background: "#6c757d",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: 6,
                                                padding: "8px 18px",
                                                fontWeight: 500,
                                                fontSize: "1rem",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={onCancel}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 18,
                        fontSize: 26,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#888",
                    }}
                    title="Cerrar"
                >
                    ×
                </button>
            </div>
        </div>
    );
}