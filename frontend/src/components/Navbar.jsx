import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">🌱 Queer Vegan Map Türkiye</h1>
      <div className="links">
        <Link to="/">Harita</Link>
        <Link to="/guide">Vegan Rehberi</Link>
        <Link to="/neden">Neden?</Link>
        <Link to="/contact">İletişim</Link>
      </div>
    </nav>
  );
}
