import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 39,
  lng: 35,
};

export default function MapView({ places = [], onPlaceClick }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  if (!isLoaded) return null;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
      {places.map((place) => (
        <Marker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          onClick={() => onPlaceClick(place)}
        />
      ))}
    </GoogleMap>
  );
}
