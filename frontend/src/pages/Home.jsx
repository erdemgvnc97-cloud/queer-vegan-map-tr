import MapView from "../components/MapView"; // Add this line

export default function Home() {
  return (
    <div className="home-container">
      <div className="map-wrapper">
        <MapView />
      </div>
    </div>
  );
}