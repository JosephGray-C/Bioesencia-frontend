export default function AdminEditarTallerModal({ editForm, onChange, onSubmit, onCancel }) {
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
                    maxWidth: 700,
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
                                Editar taller
                            </div>
                            <form onSubmit={onSubmit}>
                                <div
                                    className="input-boxes"
                                    style={{ marginTop: 18 }}
                                >
                                    <div className="input-box">
                                        <i className="fas fa-book"></i>
                                        <input
                                            type="text"
                                            name="titulo"
                                            placeholder="Título"
                                            value={editForm.titulo}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className=""></i>
                                        <textarea
                                            name="descripcion"
                                            placeholder="Descripción"
                                            value={editForm.descripcion}
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
                                        <i className="fas fa-image"></i>
                                        <input
                                            type="text"
                                            name="imagenUrl"
                                            placeholder="Imagen URL"
                                            value={editForm.imagenUrl}
                                            onChange={onChange}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaInicio"
                                            placeholder="Fecha inicio"
                                            value={editForm.fechaInicio}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-calendar"></i>
                                        <input
                                            type="datetime-local"
                                            name="fechaFin"
                                            placeholder="Fecha fin"
                                            value={editForm.fechaFin}
                                            onChange={onChange}
                                            required
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-map-marker-alt"></i>
                                        <input
                                            type="text"
                                            name="lugar"
                                            placeholder="Lugar"
                                            value={editForm.lugar}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="input-box">
                                        <i className="fas fa-users"></i>
                                        <input
                                            type="number"
                                            name="cupoMaximo"
                                            placeholder="Cupo máximo"
                                            value={editForm.cupoMaximo}
                                            onChange={onChange}
                                            required
                                            min={1}
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
                                            min={0}
                                            step="0.01"
                                        />
                                    </div>
                                    <div
                                        className="input-box"
                                        style={{ marginBottom: 0 }}
                                    >
                                        <label
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                fontWeight: 500,
                                                color: "#333",
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                name="activo"
                                                checked={editForm.activo}
                                                onChange={onChange}
                                                style={{ marginRight: 8 }}
                                            />
                                            Activo
                                        </label>
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