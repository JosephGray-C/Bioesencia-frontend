// Imports
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="header-title">Bioesencia</div>
      <nav className="header-nav">
        <Link className="header-link" to="/">Home</Link>
        <Link className="header-link" to="/about">About Us</Link>
        <Link className="header-link" to="/users">Users</Link>
        <Link className="header-link" to="/null">Other</Link>
      </nav>
    </header>
  );
}
