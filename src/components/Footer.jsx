import "../App.css";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__icon-container">
        <i className="fa-regular fa-handshake"></i>
      </div>
      <div className="footer__information-container">
        <small className="footer__copyright__content">
          © {new Date().getFullYear()}, Biosencia - 
        </small>
        <small className="footer__copyright__content">
            - Tecnología de Biosencia
        </small>
        <ul className="footer__policies-list">
          <li>
            <small className="footer__policie-item-container">
              .Política de reembolso
            </small>
          </li>
          <li>
            <small className="footer__policie-item-container">
              .Política de privacidad
            </small>
          </li>
          <li>
            <small className="footer__policie-item-container">
              .Términos del servicio
            </small>
          </li>
          <li>
            <small className="footer__policie-item-container">
              .Política de envío
            </small>
          </li>
          <li>
            <small className="footer__policie-item-container">
              .Política de envío
            </small>
          </li>
        </ul>
      </div>
    </footer>
  );
}
