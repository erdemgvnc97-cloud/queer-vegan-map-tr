import { useEffect, useMemo, useState } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import PlaceModal from "./PlaceModal";

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
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reviews, setReviews] = useState([]);

  // 📍 Mekanları çek
  useEffect(() => {
    if (!isLoaded) return;

    axios
      .get(`${API_URL}/api/places`)
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error(err));
  }, [isLoaded, API_URL]);

  // 📍 Mekana tıklanınca yorumları çek
  useEffect(() => {
    if (!selectedPlace) return;

    axios
      .get(`${API_URL}/api/places/${selectedPlace.id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [selectedPlace, API_URL]);

  if (loadError) return <p>Harita yüklenemedi</p>;
  if (!isLoaded) return <p>Harita yükleniyor…</p>;

  return (
    <>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={13}
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {places.map((place) => (
          <MarkerF
            key={place.id}
            position={{
              lat: Number(place.lat),
              lng: Number(place.lng),
            }}
            onClick={() => setSelectedPlace(place)}   // ⭐ KRİTİK SATIR
          />
        ))}
      </GoogleMap>

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          reviews={reviews}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </>
  );
}
