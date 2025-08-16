import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { useLogout } from "../hooks/useAuth";
import Swal from "sweetalert2";

const sidebarOptions = [
  { path: "/", label: "Inicio", icon: "🏠" },
  { path: "/about", label: "Sobre nosotros", icon: "ℹ️" },
  { path: "/productos", label: "Comprar", icon: "🛒" },
  { path: "/agendar", label: "Agendar cita", icon: "📅" },
  { path: "/talleres", label: "Talleres", icon: "🛠️" },
  { path: "/blogusuario", label: "Blog", icon: "📝" },
  { path: "/calendario", label: "Calendario", icon: "📆" },
];

const sidebarBottomOptions = [{ path: "/carrito", label: "Carrito", icon: "🛍️" }];

export default function UserSidebar({ open, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const logoutMutation = useLogout();

  const headerRef = useRef(null);
  const headerHeightRef = useRef(0);

  const computeHeader = () => {
    headerRef.current = document.querySelector("header");
    headerHeightRef.current = headerRef.current ? headerRef.current.offsetHeight : 0;
  };

  useEffect(() => {
    computeHeader();
    const onResize = () => computeHeader();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (open) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas cerrar sesión?",
      text: "Tendrás que volver a iniciar sesión para acceder a tu cuenta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar sesión",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#5A0D0D",
      cancelButtonColor: "#6c757d",
    });
    if (!result.isConfirmed) return;

    try {
      await logoutMutation.mutateAsync();
      setUser(null);
      navigate("/");
      Swal.fire({
        icon: "success",
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al cerrar sesión",
        text: err.message,
      });
    }
  };

  return (
    <>
      <style>{`
        .header__nav { width: 100vw; }
        @media only screen and (min-width: 720px) {
          .nav-bar--open { width: 25vw !important; }
        }
        .header__nav__element-link { text-decoration: none; color: inherit; }
        .header__nav__element:hover { background-color: #0000000A; }
      `}</style>

      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 999,
          }}
        />
      )}

      <nav
        className={`header__nav ${open ? "nav-bar--open" : ""}`}
        style={{
          visibility: open ? "visible" : "hidden",
          opacity: open ? 1 : 0,
          transition: "all .5s cubic-bezier(0.25, 1, 0.5, 1)",
          position: "fixed", // 🔹 ahora fijo al viewport
          top: headerHeightRef.current,
          left: 0,
          height: `calc(100dvh - ${headerHeightRef.current}px)`,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          backgroundColor: "#fff",
          borderTop: "1px solid var(--borderBottomColor, #e5e7eb)",
          overflowY: "auto",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* Enlaces principales */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sidebarOptions.map((opt) => (
            <li
              key={opt.path}
              className="header__nav__element"
              style={{
                minHeight: 48,
                maxHeight: 68,
                display: "flex",
                alignItems: "center",
                paddingLeft: "clamp(14px, 3.8vw, 36px)",
                fontSize: "clamp(16px, 1.3vw, 19px)",
              }}
            >
              <Link
                to={opt.path}
                className="header__nav__element-link"
                style={{
                  fontSize: "inherit",
                  color: isActive(opt.path) ? "#5A0D0D" : "#1f2937",
                  fontWeight: isActive(opt.path) ? 700 : 600,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderRadius: 8,
                  transition: "background .2s",
                }}
              >
                <span style={{ fontSize: "1.2rem", marginRight: 10 }}>{opt.icon}</span>
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ height: 6 }} />

        {/* Enlaces inferiores */}
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sidebarBottomOptions.map((opt) => (
            <li
              key={opt.path}
              className="header__nav__element"
              style={{
                minHeight: 48,
                maxHeight: 68,
                display: "flex",
                alignItems: "center",
                paddingLeft: "clamp(14px, 3.8vw, 36px)",
                fontSize: "clamp(15px, 1.2vw, 18px)",
              }}
            >
              <Link
                to={opt.path}
                className="header__nav__element-link"
                style={{
                  fontSize: "inherit",
                  color: isActive(opt.path) ? "#5A0D0D" : "#1f2937",
                  fontWeight: isActive(opt.path) ? 700 : 600,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0",
                  borderRadius: 8,
                  transition: "background .2s",
                }}
              >
                <span style={{ fontSize: "1.15rem", marginRight: 10 }}>{opt.icon}</span>
                {opt.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón cerrar sesión al fondo */}
        <div style={{ marginTop: "auto", padding: "16px" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "#5A0D0D",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontSize: "1.05rem",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </>
  );
}
