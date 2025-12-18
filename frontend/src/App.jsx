import { useState } from "react";
import MapView from "./components/MapView";
import PlaceModal from "./components/PlaceModal";

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <>
      <MapView
        places={placesFromBackend}
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
