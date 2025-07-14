import { Link } from "react-router-dom";


export default function HeaderGuest() {


  return (
    <header
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        background: "#23272f",
        boxShadow: "0 2px 8px #0001",
        position: "relative",
      }}
    >
      {/* Logo a la izquierda */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "2rem",
          color: "#5EA743",
          fontFamily: "Avenir Next, sans-serif",
          flex: "0 0 auto",
        }}
      >
        Bioesencia
      </div>
      {/* Links centrados */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: "32px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "1.1rem",
          }}
        >
          Home
        </Link>
        <Link
          to="/about"
          style={{
            color: "#fff",
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "1.1rem",
          }}
        >
          About Us
        </Link>
      </div>

      {/*  */}

      {/* Login a la derecha */}
      <Link
        to="/login"
        style={{
          fontWeight: "500",
          color: "#5A0D0D",
          fontSize: "1.1rem",
          textDecoration: "none",
          flex: "0 0 auto",
        }}
      >
        Iniciar sesión
      </Link>
    </header>
  );
}
