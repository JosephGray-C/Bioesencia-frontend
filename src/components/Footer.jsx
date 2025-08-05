export default function Footer() {
  return (
    <footer style={{
      textAlign: "center", padding: "16px 0", background: "#23272f",
      fontSize: "1rem", color: "#5EA743",
    }}>
      © {new Date().getFullYear()} Bioesencia. Todos los derechos reservados.
    </footer>
  );
}
