import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";   // 👈 EKLE
import Home from "./pages/Home.jsx";
import Guide from "./pages/Guide.jsx";
import Neden from "./pages/Neden.jsx";
import Contact from "./pages/Contact.jsx";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/neden" element={<Neden />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />   {/* 👈 EN ALTA */}
    </Router>
  );
}
