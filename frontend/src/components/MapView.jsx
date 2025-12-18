import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import PlaceModal from "./PlaceModal";

export default function MapView() {
  const API_URL = import.meta.env.VITE_API_URL;
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_KEY,
    libraries: ["places"],
  });

  const center = { lat: 39.92, lng: 32.85 };

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;
    axios.get(`${API_URL}/api/places`).then(res => setPlaces(res.data));
  }, [isLoaded]);

  const getColor = (score) =>
    score >= 8 ? "green" : score >= 5 ? "orange" : "red";

  if (!isLoaded) return <div>Harita yükleniyor…</div>;

  return (
    <>
      <GoogleMap
        center={center}
        zoom={13}
        mapContainerStyle={{ width: "100%", height: "100%" }}
      >
        <div className="map-legend">
          <span>🟢 Güvenli deneyimler</span>
          <span>🟠 Karışık deneyimler</span>
         <span>🔴 Sorun bildirilen mekânlar</span>
        </div>

        {places.map(p => (
          <MarkerF
            key={p.id}
            position={{ lat: p.lat, lng: p.lng }}
            icon={{
              url: `http://maps.google.com/mapfiles/ms/icons/${getColor(
                p.avgScore || 5
              )}-dot.png`,
            }}
            onClick={() => setSelectedPlace(p)}
          />
        ))}
      </GoogleMap>

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
}
