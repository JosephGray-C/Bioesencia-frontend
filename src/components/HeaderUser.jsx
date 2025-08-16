// src/components/HeaderUser.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import UserSidebar from "./UserSidebar";

export default function HeaderUser() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) {
        setHidden(true);    // bajando → ocultar
      } else {
        setHidden(false);   // subiendo → mostrar
      }
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: hidden ? "-90px" : "0",
          transition: "top 0.3s ease",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          background: "#A9C499",
          color: "#5A0D0D",
          boxShadow: "0 2px 8px #0001",
        }}
      >
        {/* Logo izquierda */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            fontFamily: "Avenir Next, sans-serif",
            flex: "0 0 auto",
          }}
        >
          Bioesencia
        </div>

        {/* Links centrados (desktop) */}
        <nav
          style={{
            display: "flex",
            gap: "32px",
            color: "#5A0D0D",
            alignItems: "center",
          }}
        >
          <Link to="/" style={linkStyle}>Inicio</Link>
          <Link to="/productos" style={linkStyle}>Productos</Link>
          <Link to="/talleres" style={linkStyle}>Talleres</Link>
          <Link to="/blog" style={linkStyle}>Blog</Link>
          <Link to="/calendario" style={linkStyle}>Calendario</Link>
        </nav>

        {/* Controles derecha: perfil + logout + hamburguesa */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link to="/perfilusuario" style={{ ...linkStyle, fontWeight: 600 }}>
            {user?.nombre ? `Hola, ${user.nombre}` : "Mi perfil"}
          </Link>

         

          {/* Botón hamburguesa pegado al header */}
          <button
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.6rem",
              lineHeight: 1,
              cursor: "pointer",
              color: "#5A0D0D",
            }}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </header>

      {/* Menú desplegable controlado por el header */}
      <UserSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

const linkStyle = {
  fontWeight: 600,
  textDecoration: "none",
  fontSize: "1.1rem",
  color: "#5A0D0D",
};
