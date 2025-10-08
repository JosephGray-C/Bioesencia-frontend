export default function AdminCrearCitaModal({ form, onChange, onSubmit, onCancel, serviciosDisponibles }) {
    const estadosCita = ["AGENDADA", "CANCELADA", "COMPLETADA"];
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
                                }}
                            >
                                Agregar cita
                            </div>
                            <form onSubmit={onSubmit}>
                                <div
                                    className="input-boxes"
                                    style={{ marginTop: 18 }}
                                >
                                    <div className="input-box">
                                        <input
                                            type="datetime-local"
                                            name="fechaHora"
                                            placeholder="Fecha y hora"
                                            value={form.fechaHora}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="number"
                                            name="duracion"
                                            placeholder="Duración (min)"
                                            value={form.duracion}
                                            onChange={onChange}
                                            required
                                            min={1}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <label
                                            htmlFor="servicio"
                                            style={{ marginRight: 8 }}
                                        >
                                            Servicio:
                                        </label>
                                        <select
                                            id="servicio"
                                            name="servicio"
                                            value={form.servicio}
                                            onChange={onChange}
                                            style={{
                                                padding: 6,
                                                borderRadius: 6,
                                            }}
                                            required
                                        >
                                            <option value="">
                                                Selecciona un servicio
                                            </option>
                                            {serviciosDisponibles.map((s) => (
                                                <option
                                                    key={s.id || s.nombre || s}
                                                    value={s.nombre || s}
                                                >
                                                    {s.nombre || s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <label htmlFor="estado">Estado:</label>
                                        <select
                                            name="estado"
                                            id="estado"
                                            value={form.estado}
                                            onChange={onChange}
                                            required
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                borderRadius: 6,
                                            }}
                                        >
                                            <option value="">
                                                Seleccionar estado
                                            </option>
                                            {estadosCita.map((e) => (
                                                <option key={e} value={e}>
                                                    {e}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-box">
                                        <textarea
                                            name="notas"
                                            placeholder="Notas"
                                            value={form.notas}
                                            onChange={onChange}
                                            rows={3}
                                            style={{
                                                resize: "vertical",
                                                width: "100%",
                                            }}
                                        />
                                    </div>
                                    <div
                                        className="button input-box"
                                        style={{ marginTop: 26 }}
                                    >
                                        <input
                                            type="submit"
                                            value="Guardar cita"
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