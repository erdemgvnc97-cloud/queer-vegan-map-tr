import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
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
          {/* Ana sayfa için / route'u ekleyin */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/neden" element={<Neden />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </Router>
  );
}