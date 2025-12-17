import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { Send, MapPin, ShieldCheck, Leaf } from "lucide-react";

const mapContainerStyle = { height: "65vh", width: "100%", borderRadius: "28px" };
const center = { lat: 39.0, lng: 35.2 };
const API_BASE = import.meta.env.VITE_API_URL;

const MapView = () => {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState({
    nickname: "",
    queerScore: 5,
    queerRespect: "Hayır",
    queerEmployment: "Bilinmiyor",
    veganScore: 5,
    veganPrice: "Normal",
    comment: ""
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => { fetchPlaces(); }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(\`\${API_BASE}/api/places\`);
      setPlaces(res.data);
    } catch (err) {
      console.error("API hatası:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(\`\${API_BASE}/api/reviews/\${selected.id}\`, review);
      alert("Deneyimin kaydedildi 🌈");
      setReview({
        nickname: "",
        queerScore: 5,
        queerRespect: "Hayır",
        queerEmployment: "Bilinmiyor",
        veganScore: 5,
        veganPrice: "Normal",
        comment: ""
      });
      fetchPlaces();
    } catch {
      alert("Gönderilemedi 💔");
    }
  };

  if (!isLoaded)
    return (
      <div className="p-20 text-center text-2xl font-bold text-pink-500">
        Harita yükleniyor...
      </div>
    );

  return (
    <div className="space-y-10 pb-20">
      <div className="bg-white rounded-[32px] border-8 border-white shadow-2xl overflow-hidden">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={6}>
          {places.map((p) => (
            <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }} onClick={() => setSelected(p)} />
          ))}
        </GoogleMap>
      </div>
      {selected && (
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-pink-50">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-pink-100 rounded-2xl text-pink-600">
              <MapPin size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black">{selected.name}</h3>
              <p className="text-slate-500 font-medium italic">Deneyimini paylaş</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-purple-50/50 rounded-3xl border border-purple-100 space-y-6">
              <h4 className="flex items-center gap-2 font-bold text-purple-700 text-lg">
                <ShieldCheck /> Queer Dostluk
              </h4>
              <input type="range" min="1" max="10" value={review.queerScore} onChange={e => setReview({ ...review, queerScore: e.target.value })} className="w-full accent-purple-500" />
              <select className="w-full p-3 rounded-xl border bg-white" value={review.queerRespect} onChange={e => setReview({ ...review, queerRespect: e.target.value })}>
                <option value="Hayır">Hayır, yaşanmadı</option>
                <option value="Evet">Evet, maalesef</option>
              </select>
            </div>
            <div className="p-6 bg-green-50/50 rounded-3xl border border-green-100 space-y-6">
              <h4 className="flex items-center gap-2 font-bold text-green-700 text-lg">
                <Leaf /> Vegan Seçenekler
              </h4>
              <input type="range" min="1" max="10" value={review.veganScore} onChange={e => setReview({ ...review, veganScore: e.target.value })} className="w-full accent-green-500" />
              <select className="w-full p-3 rounded-xl border bg-white" value={review.veganPrice} onChange={e => setReview({ ...review, veganPrice: e.target.value })}>
                <option value="Normal">Normal</option>
                <option value="Pahalı">Pahalı</option>
                <option value="Uygun">Uygun</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-4 pt-4">
              <input type="text" className="w-full p-4 border-2 border-slate-100 rounded-2xl" placeholder="Rumuz" required value={review.nickname} onChange={e => setReview({ ...review, nickname: e.target.value })} />
              <textarea className="w-full p-4 border-2 border-slate-100 rounded-2xl" placeholder="Deneyimini yaz..." rows="4" required value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} />
              <button type="submit" className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition">
                <Send size={20} /> Kaydet
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default MapView;
