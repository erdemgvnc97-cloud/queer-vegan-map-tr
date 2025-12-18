import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function MapView({ places, onPlaceClick }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  console.log("MapView places:", places);

  if (!isLoaded) return <div>Harita yükleniyor...</div>;

  return (
    <GoogleMap
      zoom={6}
      center={{ lat: 39, lng: 35 }}
      mapContainerStyle={{ width: "100%", height: "80vh" }}
    >
      {places.map((place) => (
        <Marker
          key={place._id}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => onPlaceClick(place)}
        />
      ))}
    </GoogleMap>
  );
}
