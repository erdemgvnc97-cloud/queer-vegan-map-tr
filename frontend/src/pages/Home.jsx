import MapView from "../components/MapView";

export default function Home() {
  return (
    <section className="home-container">
      <div className="hero-section">
        <h1 className="main-title">🏳️‍🌈 Queer Vegan Map Türkiye</h1>
        <p className="subtitle">
          Türkiye’deki queer dostu ve vegan mekanları keşfet, deneyimlerini paylaş 
          ve topluluğa katkıda bulun.
        </p>
      </div>

      <div className="map-wrapper">
        <MapView />
      </div>
    </section>
  );
}
