import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import StatsView from "./components/StatsView";
import Neden from "./pages/Neden";
import Contact from "./pages/Contact";

import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rehber" element={<Guide />} />
            <Route path="/istatistik" element={<StatsView />} />
            <Route path="/neden" element={<Neden />} />
            <Route path="/iletisim" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
