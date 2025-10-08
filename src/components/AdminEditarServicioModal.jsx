export default function AdminEditarServicioModal({ editForm, onChange, onSubmit, onCancel }) {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.25)",
                zIndex: 1050,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                className="container"
                style={{
                    maxWidth: 600,
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
                                Editar servicio
                            </div>
                            <form onSubmit={onSubmit}>
                                <div
                                    className="input-boxes"
                                    style={{ marginTop: 18 }}
                                >
                                    <div className="input-box">
                                        <i className="fas fa-tag"></i>
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre del servicio"
                                            value={editForm.nombre}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="detalle"
                                            placeholder="Detalle"
                                            value={editForm.detalle}
                                            onChange={onChange}
                                            required
                                            rows={3}
                                            style={{
                                                resize: "vertical",
                                                width: "100%",
                                            }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-dollar-sign"></i>
                                        <input
                                            type="number"
                                            name="precio"
                                            placeholder="Precio"
                                            value={editForm.precio}
                                            onChange={onChange}
                                            required
                                            min={0}
                                            step="0.01"
                                        />
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