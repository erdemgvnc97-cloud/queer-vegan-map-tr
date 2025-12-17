import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
       <h1 className="logo">🌱 Queer Vegan Map Türkiye</h1>
       <div className="links">
         <Link to="/">Harita</Link>
         <Link to="/">Contact</Link>
         <Link to="/">Guide</Link>
         <Link to="/">Neden</Link>
         <Link to="/">Home</Link>
         <Link to="/guide">Vegan Rehberi</Link>
       </div>
    </nav>
  );
}