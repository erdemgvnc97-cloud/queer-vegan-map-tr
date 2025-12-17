export default function Home() {
  return (
    <section className="p-8 text-center space-y-4">
      <h1 className="text-3xl font-bold text-emerald-600">
        🏳️‍🌈 Queer Vegan Map Türkiye
      </h1>
      <p className="text-gray-700 max-w-xl mx-auto">
        Türkiye’de queer dostu, vegan veya vegan seçenekler sunan mekanları
        keşfet. Harita üzerinden mekanları incele, deneyimlerini paylaş
        ve daha adil, kapsayıcı bir dünya için katkıda bulun.
      </p>

      <div className="mt-8">
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full shadow-md transition">
          Haritayı Aç
        </button>
      </div>
    </section>
  );
}
