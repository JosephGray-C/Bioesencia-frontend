import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function HeaderGuest() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  const scrollLockRef = useRef(0);

  // Medir altura del header
  const measureHeader = () => setHeaderH(headerRef.current?.offsetHeight ?? 0);
  useEffect(() => {
    measureHeader();
    window.addEventListener("resize", measureHeader);
    return () => window.removeEventListener("resize", measureHeader);
  }, []);

  // Ocultar/mostrar header por scroll (desactivado si el menú está abierto)
  useEffect(() => {
    const onScroll = () => {
      if (menuOpen) return;
      const y = window.scrollY;
      if (y > lastScroll && y > 50) setHidden(true);
      else setHidden(false);
      setLastScroll(y);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll, menuOpen]);

  // Abrir/cerrar menú: bloquear scroll de fondo y forzar header visible
  useEffect(() => {
    if (menuOpen) {
      setHidden(false);          // header siempre visible con menú abierto
      measureHeader();           // re-medimos por si cambió altura

      // BLOQUEO DE SCROLL (funciona también en iOS Safari)
      scrollLockRef.current = window.scrollY;
      const y = scrollLockRef.current;
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.documentElement.style.overscrollBehavior = "none";
    } else {
      // Restaurar scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.overscrollBehavior = "";
      window.scrollTo(0, scrollLockRef.current || 0);
    }
    return () => {
      // Limpieza por si se desmonta
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.documentElement.style.overscrollBehavior = "";
    };
  }, [menuOpen]);

  return (
    <>
      <style>{`
        .hg-nav { display:flex; gap:32px; align-items:center; }
        .hg-link { font-weight:600; text-decoration:none; font-size:1.1rem; color:#5A0D0D; }
        .hg-actions { display:flex; align-items:center; gap:16px; }
        .hg-burger { display:none; background:transparent; border:none; font-size:1.6rem; line-height:1; color:#5A0D0D; cursor:pointer; }
        @media (max-width: 768px) {
          .hg-nav { display:none; }
          .hg-burger { display:inline-flex; }
          .hg-login { display:none; } /* evita duplicar "Iniciar sesión" en móvil */
        }
      `}</style>

      <header
        ref={headerRef}
        style={{
          position: "sticky",
          // Forzamos header visible si el menú está abierto
          top: menuOpen ? "0" : hidden ? "-90px" : "0",
          transition: "top 0.3s ease",
          zIndex: 1002, // por encima del menú y overlay
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 20px",
          background: "#A9C499",
          color: "#5A0D0D",
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
            fontFamily: "Avenir Next, sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          Bioesencia
        </div>

        <nav className="hg-nav">
          <Link to="/" className="hg-link">Inicio</Link>
          <Link to="/about" className="hg-link">Sobre Nosotros</Link>
          <Link to="/blogusuario" className="hg-link">Blog Bioesencia</Link>
        </nav>

        <div className="hg-actions">
          <Link to="/login" className="hg-link hg-login" style={{ fontWeight: 500 }}>
            Iniciar sesión
          </Link>
          <button
            className="hg-burger"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 999,
          }}
        />
      )}

      {/* Menú móvil fijo, siempre debajo del header visible */}
      <nav
        style={{
          position: "fixed",
          top: headerH, // como el header está forzado visible, el menú arranca debajo
          left: 0,
          right: 0,
          width: "100vw",
          height: `calc(100dvh - ${headerH}px)`,
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          overflowY: "auto",
          zIndex: 1001,
          transition: "opacity .35s ease, visibility .35s ease",
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? "visible" : "hidden",
          pointerEvents: menuOpen ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          padding: "12px 0",
        }}
      >
        <Link to="/" onClick={() => setMenuOpen(false)} style={mobileItemStyle}>Inicio</Link>
        <Link to="/about" onClick={() => setMenuOpen(false)} style={mobileItemStyle}>Sobre Nosotros</Link>
        <Link to="/blogusuario" onClick={() => setMenuOpen(false)} style={mobileItemStyle}>Blog Bioesencia</Link>
        <Link to="/login" onClick={() => setMenuOpen(false)} style={{ ...mobileItemStyle, marginTop: 8 }}>
          Iniciar sesión
        </Link>
      </nav>
    </>
  );
}

const mobileItemStyle = {
  display: "flex",
  alignItems: "center",
  minHeight: 48,
  padding: "12px 20px",
  fontWeight: 600,
  fontSize: "1.05rem",
  color: "#5A0D0D",
  textDecoration: "none",
  borderRadius: 8,
};
