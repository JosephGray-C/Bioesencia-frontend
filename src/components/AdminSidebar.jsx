import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useLogout } from "../hooks/useAuth";
import Swal from "sweetalert2";

// Añade aquí todas las opciones de navegación admin
const adminOptions = [
  { path: "/admin/productos", label: "Productos", icon: "🛒" },
  { path: "/admin/talleres", label: "Talleres", icon: "📚" }, // NUEVO: enlace a talleres
  { path: "/admin/servicios", label: "Servicios", icon: "🛠️" },
];

export default function AdminSidebar() {
  const location = useLocation();
  const { setUser } = useUser();
  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      text: "Tendrás que volver a iniciar sesión para acceder al panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#5A0D0D",
      cancelButtonColor: "#6c757d"
    });

    if (result.isConfirmed) {
      try {
        await logoutMutation.mutateAsync();
        setUser(null);
        navigate("/");
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente."
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error al cerrar sesión",
          text: err.message
        });
      }
    }
  };

  return (
    <aside
      style={{
        minWidth: 240,
        background: "#23272f",
        height: "100vh",
        borderRight: "1.5px solid #23272f",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {adminOptions.map(opt => (
            <li key={opt.path}>
              <Link
                to={opt.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 30px",
                  color: location.pathname === opt.path ? "#fff" : "#fff",
                  background: location.pathname === opt.path ? "#23272f" : "transparent",
                  borderRadius: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "1.06rem",
                  marginBottom: 2,
                  transition: "color 0.2s, background 0.2s"
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{opt.icon}</span>
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Botón cerrar sesión abajo */}
      <div style={{
        padding: "0 24px 24px 24px",
        marginTop: "auto",
        textAlign: "center"
      }}>
        <button
          onClick={handleLogout}
          style={{
            background: "#5A0D0D",
            color: "#fff",
            fontWeight: 600,
            border: "none",
            borderRadius: 10,
            padding: "12px 0",
            width: "100%",
            cursor: "pointer",
            fontSize: "1rem"
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
