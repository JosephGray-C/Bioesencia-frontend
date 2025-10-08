export default function AdminCrearProductoModal({ form, onChange, onSubmit, onCancel }) {
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
                                Agregar producto
                            </div>
                            <form onSubmit={onSubmit}>
                                <div
                                    className="input-boxes"
                                    style={{ marginTop: 18 }}
                                >
                                    {[
                                        "nombre",
                                        "descripcion",
                                        "precio",
                                        "stock",
                                        "imagenUrl",
                                    ].map((key) => (
                                        <div className="input-box" key={key}>
                                            <i
                                                className={`fas fa-${
                                                    key === "nombre"
                                                        ? "tag"
                                                        : key === "descripcion"
                                                        ? "align-left"
                                                        : key === "precio"
                                                        ? "dollar-sign"
                                                        : key === "stock"
                                                        ? "boxes"
                                                        : "image"
                                                }`}
                                            ></i>
                                            {key === "descripcion" ? (
                                                <textarea
                                                    name="descripcion"
                                                    placeholder="Descripcion"
                                                    value={form.descripcion}
                                                    onChange={onChange}
                                                    style={{
                                                        resize: "vertical",
                                                        minHeight: 48,
                                                        width: "100%",
                                                    }}
                                                />
                                            ) : (
                                                <input
                                                    type={
                                                        key === "precio" ||
                                                        key === "stock"
                                                            ? "number"
                                                            : "text"
                                                    }
                                                    name={key}
                                                    placeholder={
                                                        key
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        key.slice(1)
                                                    }
                                                    value={form[key]}
                                                    onChange={onChange}
                                                    required={[
                                                        "nombre",
                                                        "precio",
                                                        "stock",
                                                    ].includes(key)}
                                                    min={
                                                        [
                                                            "precio",
                                                            "stock",
                                                        ].includes(key)
                                                            ? 0
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        </div>
                                    ))}
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
                                                checked={form.activo}
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
                                            value="Guardar producto"
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
