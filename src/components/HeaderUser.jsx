// src/components/HeaderUser.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import UserSidebar from "./UserSidebar";
import AdminSidebar from "./AdminSidebar"; // ⬅️ agregado

export default function HeaderUser() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();   // quitamos logout porque no se usa aquí

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 50) setHidden(true);
      else setHidden(false);
      setLastScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Normaliza el rol para evitar problemas por capitalización o prefijos
  const rol = (user?.rol || "").toString().toUpperCase().replace(/^ROLE_/, "");
  const esAdmin = rol === "ADMIN";

  return (
      <>
        <style>{`
        .hu{position:sticky;top:0;z-index:1000;background:#A9C499;color:#5A0D0D;box-shadow:0 2px 8px #0001;transition:top .3s ease;}
        .hu--hidden{top:-90px;}
        .hu__wrap{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;}
        .hu__brand{font-weight:900;font-size:clamp(20px,5.5vw,32px);font-family:Avenir Next,system-ui,sans-serif;letter-spacing:.4px;}
        .hu__nav{display:flex;gap:28px;align-items:center;}
        .hu__right{display:flex;gap:16px;align-items:center;}
        .hu__link{font-weight:600;text-decoration:none;font-size:1.05rem;color:#5A0D0D;background:none;border:none;cursor:pointer;}
        .hu__menu{background:transparent;border:none;width:40px;height:40px;font-size:24px;line-height:40px;cursor:pointer;color:#5A0D0D;}
        /* Responsive */
        @media (max-width: 900px){ .hu__nav{display:none;} }         
        @media (max-width: 600px){ .hu__wrap{padding:12px 14px;} .hu__right>a, .hu__right>button.linklike{display:none;} }
      `}</style>

        <header className={`hu ${hidden ? "hu--hidden" : ""}`}>
          <div className="hu__wrap">
            {/* Izquierda: logo (imagen en lugar del título) */}
            <img
                src="/imgs/BIOESENCIA_n-BG.png"
                alt="Bioesencia"
                style={{ height: 60, display: "block" }}
            />

            {/* Centro: links (solo si NO es admin) */}
            {!esAdmin && (
                <nav className="hu__nav">
                  <Link to="/" className="hu__link">Inicio</Link>
                  <Link to="/productos" className="hu__link">Productos</Link>
                  <Link to="/talleres" className="hu__link">Talleres</Link>
                  <Link to="/blogusuario" className="hu__link">Blog</Link>
                  <Link to="/calendario" className="hu__link">Calendario</Link>
                </nav>
            )}

            {/* Derecha: perfil + hamburguesa */}
            <div className="hu__right">
              {/* Si es ADMIN, se muestra como botón con estilo de link */}
              {esAdmin ? (
                  <button
                      type="button"
                      className="hu__link linklike"
                      disabled
                  >
                    {user?.nombre ? `Hola, ${user.nombre}` : "Mi perfil"}
                  </button>
              ) : (
                  <Link to="/perfilusuario" className="hu__link">
                    {user?.nombre ? `Hola, ${user.nombre}` : "Mi perfil"}
                  </Link>
              )}

              <button
                  aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                  className="hu__menu"
                  onClick={() => setMenuOpen(v => !v)}
                  title={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {menuOpen ? "✖" : "☰"}
              </button>
            </div>
          </div>
        </header>

        {/* Menú lateral controlado */}
        {esAdmin ? (
            <AdminSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        ) : (
            <UserSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
        )}
      </>
  );
}