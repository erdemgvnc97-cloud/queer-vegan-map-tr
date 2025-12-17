import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Guide from "./pages/Guide.jsx";
import Neden from "./pages/Neden.jsx";
import Contact from "./pages/Contact.jsx";
import "./index.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home.jsx />} />
          <Route path="/guide" element={<Guide.jsx />} />
          <Route path="/neden" element={<Neden.jsx />} />
          <Route path="/contact" element={<Contact.jsx />} />
        </Routes>
      </main>
    </Router>
  );
}
