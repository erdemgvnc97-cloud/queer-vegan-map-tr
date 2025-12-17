import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; // .jsx yazmasa da olur, daha temizdir
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Neden from "./pages/Neden";
import Contact from "./pages/Contact";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          {/* Sadece component isimlerini kullanıyoruz: */}
          <Route path="/" element={<Home />} /> 
          <Route path="/guide" element={<Guide />} />
          <Route path="/neden" element={<Neden />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </Router>
  );
}