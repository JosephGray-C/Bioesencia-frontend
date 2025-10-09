// src/components/HeaderUser.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import UserSidebar from "./UserSidebar";
import AdminSidebar from "./AdminSidebar";

export default function HeaderUser() {
    const [hidden, setHidden] = useState(false);
    const [lastScroll, setLastScroll] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > lastScroll && currentScroll > 50)
                setHidden(true);
            else setHidden(false);
            setLastScroll(currentScroll);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScroll]);

    const rol = (user?.rol || "")
        .toString()
        .toUpperCase()
        .replace(/^ROLE_/, "");
    const esAdmin = rol === "ADMIN";

    return (
        <>
            <header className={`hu ${hidden ? "hu--hidden" : ""}`}>
                <div className="hu__wrap">
                    <img
                        src="/imgs/BIOESENCIA_n-BG.png"
                        alt="Bioesencia"
                        style={{
                            height: "clamp(45px, 8vw, 60px)",
                            display: "block",
                            flexShrink: 0,
                        }}
                    />

                    <nav className="hu__nav">
                        {esAdmin ? (
                            <>
                                <Link to="/admin/citas" className="hu__link">
                                    Citas
                                </Link>
                                <Link
                                    to="/admin/servicios"
                                    className="hu__link"
                                >
                                    Servicios
                                </Link>
                                <Link to="/admin/talleres" className="hu__link">
                                    Talleres
                                </Link>
                                <Link
                                    to="/admin/inscripciones"
                                    className="hu__link"
                                >
                                    Inscripciones
                                </Link>
                                <Link
                                    to="/admin/productos"
                                    className="hu__link"
                                >
                                    Productos
                                </Link>
                                <Link to="/admin/ordenes" className="hu__link">
                                    Órdenes
                                </Link>
                                <Link to="/admin/blog" className="hu__link">
                                    Blog
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/" className="hu__link">
                                    Inicio
                                </Link>
                                <Link to="/about" className="hu__link">
                                    Nosotros
                                </Link>
                                <Link to="/agendar" className="hu__link">
                                    Agendar
                                </Link>
                                <Link to="/calendario" className="hu__link">
                                    Calendario
                                </Link>
                                <Link to="/talleres" className="hu__link">
                                    Talleres
                                </Link>
                                <Link to="/productos" className="hu__link">
                                    Comprar
                                </Link>
                                {/* <Link to="/carrito" className="hu__link">
                                    Carrito
                                </Link> */}
                                <Link to="/blogusuario" className="hu__link">
                                    Blog
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Derecha: perfil + hamburguesa */}
                    <div className="hu__right">
                        {!esAdmin && (
                            <Link
                                to="/carrito"
                                className="hu__link cart-link"
                                title="Carrito de compras"
                            >
                                <i
                                    className="fas fa-shopping-cart"
                                    style={{ fontSize: "18px" }}
                                ></i>
                            </Link>
                        )}
                        {esAdmin ? (
                            <button
                                type="button"
                                className="hu__link linklike profile-button"
                                disabled
                                title={
                                    user?.nombre
                                        ? `Hola, ${user.nombre}`
                                        : "Mi perfil"
                                }
                            >
                                <span className="profile-text">
                                    {user?.nombre
                                        ? `Hola, ${user.nombre}`
                                        : "Mi perfil"}
                                </span>
                            </button>
                        ) : (
                            <Link
                                to="/perfilusuario"
                                className="hu__link profile-link"
                                title={
                                    user?.nombre
                                        ? `Hola, ${user.nombre}`
                                        : "Mi perfil"
                                }
                            >
                                <span className="profile-text">
                                    {user?.nombre
                                        ? `Hola, ${user.nombre}`
                                        : "Mi perfil"}
                                </span>
                            </Link>
                        )}

                        <button
                            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                            className="hu__menu"
                            onClick={() => setMenuOpen((v) => !v)}
                            title={menuOpen ? "Cerrar menú" : "Abrir menú"}
                        >
                            {menuOpen ? "✖" : "☰"}
                        </button>
                    </div>
                </div>
            </header>

            {esAdmin ? (
                <AdminSidebar
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            ) : (
                <UserSidebar
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                />
            )}
        </>
    );
}
