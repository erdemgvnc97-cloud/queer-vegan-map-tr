import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

export default function MapView() {
  const libraries = useMemo(() => ["places"], []);
  const center = useMemo(() => ({ lat: 39.92, lng: 32.85 }), []);

  const API_URL = import.meta.env.VITE_API_URL;
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_KEY,
    libraries,
  });

  const [places, setPlaces] = useState([]);
  const [map, setMap] = useState(null);

  // 🔍 Debug – çok önemli
  useEffect(() => {
    console.log("MAP STATUS →", {
      isLoaded,
      loadError,
      GOOGLE_KEY_EXISTS: !!GOOGLE_KEY,
      API_URL,
    });
  }, [isLoaded, loadError, GOOGLE_KEY, API_URL]);

  // 📍 Backend’den mekanları çek
  useEffect(() => {
    if (!isLoaded || !API_URL) return;

    axios
      .get(`${API_URL}/api/places`)
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("PLACES ERROR:", err));
  }, [isLoaded, API_URL]);

  // ❌ Harita yüklenemediyse
  if (loadError) {
    return (
      <div style={{ padding: 40, fontWeight: "bold", color: "red" }}>
        Google Maps yüklenemedi ❌ <br />
        API KEY veya domain restriction kontrol et
      </div>
    );
  }

  // ⏳ Yükleniyor
  if (!isLoaded) {
    return (
      <div style={{ padding: 40, fontWeight: "bold", color: "#999" }}>
        Harita yükleniyor…
      </div>
    );
  }

  // ✅ HARİTA
  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={13}
      onLoad={(m) => setMap(m)}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      {places.map((p) => (
        <MarkerF
          key={p.id}
          position={{
            lat: Number(p.lat),
            lng: Number(p.lng),
          }}
        />
      ))}
    </GoogleMap>
  );
}
