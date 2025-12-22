import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import PlaceModal from "./PlaceModal";

const center = { lat: 39.0, lng: 35.0 };
const libraries = ['places']; // sabit array – yeniden render'da değişmemeli

export default function MapView() {
  console.log("🟢 MapView çalıştı");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [map, setMap] = useState(null);

  // harita click event'i
  useEffect(() => {
    if (!map || !isLoaded) return;

    console.log("🎯 Event listener ekleniyor...");

    const listener = map.addListener("click", (e) => {
      console.log("🖱️ Tıklama event'i yakalandı!", e);

      if (e.placeId) {
        console.log("📍 Place ID bulundu:", e.placeId);
        e.stop(); // Google'ın kendi popup'ını engelle

        const service = new window.google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: e.placeId,
            fields: ["name", "geometry", "formatted_address", "place_id"],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log("✅ Mekan bilgisi alındı:", place);
              const placeData = {
                id: place.place_id,
                name: place.name,
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
              };
              console.log("🔄 setSelectedPlace çağrılıyor:", placeData);
              setSelectedPlace(placeData);
            } else {
              console.error("❌ Place Details hatası:", status);
            }
          }
        );
      } else {
        console.log("📍 Boş alana tıklandı");
        setSelectedPlace({
          id: "new",
          name: "Yeni Mekan",
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        });
      }
    });

    return () => {
      console.log("🧹 Event listener temizleniyor");
      window.google.maps.event.removeListener(listener);
    };
  }, [map, isLoaded]);

  if (loadError) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fee",
          color: "#c00",
          fontSize: "20px",
          fontWeight: "bold",
        }}
      >
        ❌ Harita yüklenemedi: {loadError.message}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#e3f2fd",
          color: "#1976d2",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        ⏳ Harita yükleniyor...
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <GoogleMap
        center={center}
        zoom={6}
        onLoad={(mapInstance) => setMap(mapInstance)}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        options={{
          clickableIcons: true,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* Eğer özel marker'lar varsa, Google InfoWindow açılmasın */}
        {selectedPlace && (
          <Marker
            position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
            onClick={(e) => {
              e.stop(); // Google InfoWindow'u engelle
              setSelectedPlace(selectedPlace);
            }}
            options={{
              title: "", // boş bırak — varsayılan popup tetiklenmesin
              clickable: true,
            }}
          />
        )}
      </GoogleMap>

      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          onClose={() => {
            console.log("🚪 Modal kapatılıyor");
            setSelectedPlace(null);
          }}
        />
      )}
    </div>
  );
}
