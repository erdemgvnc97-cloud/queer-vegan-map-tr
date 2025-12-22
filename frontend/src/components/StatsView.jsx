import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function StatsView() {
  const [places, setPlaces] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [placesRes, reviewsRes] = await Promise.all([
          fetch(`${API}/api/places`),
          fetch(`${API}/api/reviews/all`)
        ]);
        const placesData = await placesRes.json();
        const reviewsData = await reviewsRes.json();

        setPlaces(placesData);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold text-gray-600">
        ⏳ Veriler yükleniyor...
      </div>
    );
  }

  // Ortalama puana göre sıralama
  const bestPlaces = [...places]
    .sort((a, b) => b.averageScore - a.averageScore)
    .slice(0, 5);

  const worstPlaces = [...places]
    .sort((a, b) => a.averageScore - b.averageScore)
    .slice(0, 5);

  const latestReviews = [...reviews]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-6 font-sans">
      <h1 className="text-4xl font-semibold mb-12 text-gray-800">📊 İstatistikler</h1>

      {/* 🆕 Son Yorumlar */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-2xl font-bold text-emerald-700 mb-4">🆕 Son Eklenen Yorumlar</h2>
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="p-3">Kullanıcı</th>
                <th className="p-3">Mekan</th>
                <th className="p-3">Puan</th>
                <th className="p-3">Yorum</th>
              </tr>
            </thead>
            <tbody>
              {latestReviews.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-700">{r.nickname || "Anonim"}</td>
                  <td className="p-3">{r.placeName}</td>
                  <td className="p-3">{((r.queerRespect + r.animalFriendly + r.veganQuality) / 3).toFixed(1)}</td>
                  <td className="p-3 text-gray-600">{r.comment || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 🏆 En İyi Mekanlar */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-2xl font-bold text-green-700 mb-4">🏆 En Yüksek Puan Alan Mekanlar</h2>
        <ul className="bg-white shadow-md rounded-2xl divide-y">
          {bestPlaces.map((p) => (
            <li key={p.id} className="p-4 flex justify-between">
              <span className="font-medium text-gray-800">{p.name}</span>
              <span className="font-bold text-green-600">{p.averageScore}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ⚠️ En Düşük Puan Alan Mekanlar */}
      <section className="w-full max-w-4xl mb-16">
        <h2 className="text-2xl font-bold text-red-700 mb-4">⚠️ En Düşük Puan Alan Mekanlar</h2>
        <ul className="bg-white shadow-md rounded-2xl divide-y">
          {worstPlaces.map((p) => (
            <li key={p.id} className="p-4 flex justify-between">
              <span className="font-medium text-gray-800">{p.name}</span>
              <span className="font-bold text-red-600">{p.averageScore}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
