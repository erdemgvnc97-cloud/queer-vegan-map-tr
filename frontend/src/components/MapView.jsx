import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import PlaceModal from "./PlaceModal";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 39.0,
  lng: 35.0,
};

export default function MapView() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // 🔹 Mekanları backend'den çek
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/places`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setPlaces(data);
        } else {
          console.warn("Places array değil:", data);
          setPlaces([]);
        }
      } catch (err) {
        console.error("Places fetch error:", err);
        setPlaces([]);
      }
    };

    fetchPlaces();
  }, []);

  if (!isLoaded) {
    return <div style={{ padding: 20 }}>Harita yükleniyor…</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={6}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* 🔴 Markerlar */}
{places.map((place) => {
  if (place.lat == null || place.lng == null) return null;

  return (
    <Marker
      key={place.id}
      position={{
        lat: place.lat,
        lng: place.lng,
      }}
      onClick={() => setSelectedPlace(place)}
    />
  );
})}

      </GoogleMap>

      {/* 🧾 Modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
}
