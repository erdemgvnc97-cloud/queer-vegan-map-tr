import { useEffect, useState } from "react";
import MapView from "./components/MapView";
import PlaceModal from "./components/PlaceModal";

function App() {
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    fetch("https://queer-vegan-map-tr.onrender.com/api/places")
      .then((res) => res.json())
      .then((data) => setPlaces(data))
      .catch(console.error);
  }, []);

  return (
    <>
      <MapView
        places={places}
        onPlaceClick={(place) => setSelectedPlace(place)}
      />

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
}

export default App;
