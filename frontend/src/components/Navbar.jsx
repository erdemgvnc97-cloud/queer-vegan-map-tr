/* frontend/src/components/Navbar.jsx */
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
       <h1 className="logo">🌱 Queer Vegan Map</h1>
       <div className="links">
         <Link to="/">Harita</Link>
         <Link to="/rehber">Vegan Rehberi</Link>
         <Link to="/neden">Neden?</Link>
         <Link to="/iletisim">İletişim</Link>
       </div>
    </nav>
  );
}