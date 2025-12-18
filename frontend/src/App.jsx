import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MapView from "./components/MapView";
import PlaceModal from "./components/PlaceModal";

import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Neden from "./pages/Neden";
import Contact from "./pages/Contact";

function App() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/places`)
      .then((r) => r.json())
      .then(setPlaces);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <MapView
                  places={places}
                  onPlaceClick={setSelectedPlace}
                />
                {selectedPlace && (
                  <PlaceModal
                    place={selectedPlace}
                    onClose={() => setSelectedPlace(null)}
                  />
                )}
              </>
            }
          />
          <Route path="/guide" element={<Guide />} />
          <Route path="/neden" element={<Neden />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
