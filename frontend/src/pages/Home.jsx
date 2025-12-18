import MapView from "../components/MapView"; [cite: 33]

export default function Home() {
  return (
    <section className="home-container">
      <div className="hero-section">
        <h1 className="main-title">🏳️‍🌈 Queer Vegan Map Türkiye</h1>
        <p className="subtitle">
          Türkiye’deki queer dostu ve vegan mekanları keşfet, deneyimlerini paylaş 
          ve topluluğa katkıda bulun. [cite: 81]
        </p>
      </div>

      <div className="map-wrapper">
        <MapView /> [cite: 33, 70]
      </div>
    </section>
  );
}