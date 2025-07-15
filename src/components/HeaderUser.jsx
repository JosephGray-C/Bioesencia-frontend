import { useUser } from "../context/UserContext";

export default function HeaderUser() {
  const { user } = useUser();

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
      {/* Solo datos usuario (derecha) */}
      {user && (
        <div style={{
          color: "#5EA743",
          fontWeight: 600,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        }}>
          <span>{user.nombre}</span>
          <span style={{
            fontWeight: 400,
            fontSize: "0.95rem",
            color: "#fff"
          }}>{user.email}</span>
        </div>
      )}
    </header>
  );
}
