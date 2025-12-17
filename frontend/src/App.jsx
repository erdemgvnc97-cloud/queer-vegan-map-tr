import React from "react";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen bg-[#fef9fb]">
      <header className="py-10 text-center">
        <h1 className="text-6xl font-extrabold italic bg-gradient-to-r from-fuchsia-600 via-pink-500 to-green-500 bg-clip-text text-transparent uppercase tracking-tight drop-shadow-md">
          Queer Vegan Map Türkiye
        </h1>
        <p className="text-gray-600 mt-4 text-lg font-medium">
          Topluluğun deneyimleriyle queer ve vegan dostu mekanları keşfet 💕
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <MapView />
      </main>

      <footer className="text-center py-6 text-sm text-gray-400">
        © {new Date().getFullYear()} Q-V Map TR 🌈 | Made with ❤️ for community
      </footer>
    </div>
  );
}

export default App;
