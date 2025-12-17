import React from "react";
import MapView from "./components/MapView";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen pt-12 px-6 bg-[#fef9fb]">
      <header className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-extrabold italic bg-gradient-to-r from-purple-600 via-pink-500 to-green-500 bg-clip-text text-transparent uppercase tracking-tight">
          Queer Vegan Map Türkiye
        </h1>
        {/* Hata buradaydı: <p> açılıp </h1> ile kapatılmıştı. Şimdi düzelttik: */}
        <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl mx-auto">
          Queer dostu ve Vegan dostu mekanları incele.
        </p>
      </header>
      <main className="max-w-6xl mx-auto">
        <MapView />
      </main>
    </div>
  );
}

export default App;