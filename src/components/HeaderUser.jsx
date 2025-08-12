import {useUser} from "../context/UserContext";
import {useNavigate} from "react-router-dom";

export default function HeaderUser() {
    const {user} = useUser();
    const navigate = useNavigate();

    return (
        <header className="header" style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            background: "#23272f",
            boxShadow: "0 2px 8px #0001",
            position: "relative"
        }}>
            {/* Empresa (izquierda) */}
            <div style={{
                fontWeight: "bold",
                fontSize: "2rem",
                color: "#5EA743",
                fontFamily: "Avenir Next, sans-serif",
                flex: "0 0 auto"
            }}>
                Bioesencia
            </div>

            {/* Solo datos usuario + botón perfil */}
            {user && (
                <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                    <div
                        style={{
                            color: "#5EA743",
                            fontWeight: 600,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end"
                        }}
                    >
                        <span>{user.nombre}</span>
                        <span
                            style={{
                                fontWeight: 400,
                                fontSize: "0.95rem",
                                color: "#fff"
                            }}>{user.email}
            </span>
                    </div>

                    {/* Botón icono de usuario */}
                    <button
                        onClick={() => navigate("/perfilusuario")}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "#5EA743"
                        }}
                        title="Ver perfil"
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8
              3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z"/>
                        </svg>
                    </button>
                </div>
            )}
        </header>
    );
}
