import { useEffect } from "react";

export default function MapView({ places, onPlaceClick }) {
  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(
      document.getElementById("map"),
      {
        center: { lat: 39.92077, lng: 32.85411 }, // Ankara merkez
        zoom: 13,
        disableDefaultUI: true,
      }
    );

    places.forEach((place) => {
      if (!place.lat || !place.lng) return;

      const marker = new window.google.maps.Marker({
        position: {
          lat: Number(place.lat),
          lng: Number(place.lng),
        },
        map,
        title: place.name,
      });

      // ⭐ KRİTİK KISIM
      marker.addListener("click", () => {
        onPlaceClick(place);
      });
    });

    // cleanup
    return () => {};
  }, [places, onPlaceClick]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100vh",
      }}
    />
  );
}
