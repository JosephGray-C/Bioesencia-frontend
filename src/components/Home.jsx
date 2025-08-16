import React from "react";
import "../assets/css/homepage.css";
import "../App.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";





export default function Home() {
   const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  
  return (
    <div className="home-main">
      <h1>Pagina de Inicio</h1>
  
      <p>
        En Bioesencia CR nos especializamos en promover el bienestar integral, conectando cuerpo, mente y emociones. Combinamos psicología, terapias naturales y herramientas de desarrollo personal para ayudarte a reconectar con tu esencia y vivir en equilibrio. Nuestro compromiso es acompañarte en tu proceso de sanación y crecimiento, brindando un espacio seguro, humano y profesional.
      </p>

      {/* Sección de contacto */}
      <div className="main__contact-section" id="contactsection">
        <img
          className="main__contact-section__img img"
          src="/imgs/bioesencia-logo.jpg"
          alt="Imagen de contacto"
        />
        <div className="main__contact-section__contact-information-container">
          <h2 className="main__contact-section__title">
            Síguenos en nuestras redes sociales
          </h2>
          <p className="main__contact-section__information">
            Seguinos para enterarte de todas las novedades.
           Estamos ubicados en Costa Rica, San José, Aserrí
          </p>
          <div className="main__contact-section__links">
            <a
              className="main__contact-section__link"
              target="_blank"
              rel="noopener noreferrer"
              href=""
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a
              className="main__contact-section__link"
              target="_blank"
              rel="noopener noreferrer"
              href=""
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              className="main__contact-section__link"
              target="_blank"
              rel="noopener noreferrer"
              href=""
            >
              <i className="fa-brands fa-tiktok"></i>
            </a>
            <a
              className="main__contact-section__link"
              target="_blank"
              rel="noopener noreferrer"
              href=""
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a
              className="main__contact-section__link"
              target="_blank"
              rel="noopener noreferrer"
              href=""
            >
              <i className="fa-solid fa-envelope"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
