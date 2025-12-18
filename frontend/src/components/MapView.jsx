import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Send, ShieldCheck, Leaf } from "lucide-react";

const mapContainerStyle = {
  height: "65vh",
  width: "100%",
  borderRadius: "24px",
};
const center = { lat: 39.0, lng: 35.2 };

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
    comment: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/places`)
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("API Hatası:", err));
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reviews/${selected.id}`, review);
      alert("🌈 Deneyimin başarıyla eklendi!");
      setReview({
        nickname: "",
        queerScore: 5,
        queerRespect: "Hayır",
        queerEmployment: "Bilinmiyor",
        veganScore: 5,
        veganPrice: "Normal",
        comment: "",
      });
    } catch (err) {
      alert("Bir hata oluştu, tekrar dene 💔");
    }
  };

  if (!isLoaded)
    return (
      <div className="text-center p-20 text-pink-500 text-xl font-bold animate-pulse">
        Harita yükleniyor...
      </div>
    );

  return (
    <div className="space-y-12">
      <div className="shadow-xl border border-pink-100 overflow-hidden rounded-[24px]">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={6}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            clickableIcons: false, // Google'ın kendi yerlerinin tıklanmasını kapatır
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ 
                lat: Number(place.lat), 
                lng: Number(place.lng) 
              }}
              onClick={() => setSelected(place)}
            />
          ))}
        </GoogleMap>
      </div>

      {selected ? (
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-fuchsia-50 mt-10">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 text-center md:text-left">
            <div className="p-5 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl text-pink-600 shadow-sm">
              <MapPin size={40} />
            </div>
            <div>
              <h3 className="text-4xl font-black text-gray-800">
                {selected.name} {/* Artık tıkladığın mekanın adı yazar */}
              </h3>
              <p className="text-purple-500 font-medium tracking-wide uppercase text-sm mt-1">
                Toplulukla Deneyimini Paylaş 🌈
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Queer Dostluk Kartı */}
            <div className="p-8 bg-gradient-to-b from-purple-50 to-white rounded-[2.5rem] border border-purple-100">
              <h4 className="flex items-center gap-3 font-bold text-purple-700 text-xl mb-6">
                <ShieldCheck className="text-purple-500" /> Queer Güvenliği
              </h4>
              <div className="space-y-8">
                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700 text-sm">Güvenli Alan Skoru</span>
                    <span className="text-purple-600 font-bold">{review.queerScore}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={review.queerScore}
                    onChange={(e) => setReview({ ...review, queerScore: e.target.value })}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </label>
                <label className="block">
                  <span className="font-bold text-gray-700 text-sm block mb-2">Ayrımcılık Yaşandı mı?</span>
                  <select
                    className="w-full p-4 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-400 outline-none"
                    value={review.queerRespect}
                    onChange={(e) => setReview({ ...review, queerRespect: e.target.value })}
                  >
                    <option>Hayır ✨</option>
                    <option>Evet ⚠️</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Vegan Seçenekler Kartı */}
            <div className="p-8 bg-gradient-to-b from-green-50 to-white rounded-[2.5rem] border border-green-100">
              <h4 className="flex items-center gap-3 font-bold text-green-700 text-xl mb-6">
                <Leaf className="text-green-500" /> Vegan Menü
              </h4>
              <div className="space-y-8">
                <label className="block">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700 text-sm">Seçenek Bolluğu</span>
                    <span className="text-green-600 font-bold">{review.veganScore}/10</span>
                  </div>
                  <input
                    type="range" min="1" max="10"
                    value={review.veganScore}
                    onChange={(e) => setReview({ ...review, veganScore: e.target.value })}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </label>
                <label className="block">
                  <span className="font-bold text-gray-700 text-sm block mb-2">Fiyat Seviyesi</span>
                  <select
                    className="w-full p-4 bg-white border-2 border-green-100 rounded-2xl focus:border-green-400 outline-none"
                    value={review.veganPrice}
                    onChange={(e) => setReview({ ...review, veganPrice: e.target.value })}
                  >
                    <option>Uygun 💸</option>
                    <option>Normal ⚖️</option>
                    <option>Pahalı 💎</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6 mt-4">
              <input
                type="text"
                placeholder="Rumuzun (Örn: mor_marul)"
                className="w-full p-5 border-2 border-gray-100 rounded-2xl outline-none focus:border-purple-300"
                value={review.nickname}
                onChange={(e) => setReview({ ...review, nickname: e.target.value })}
              />
              <textarea
                placeholder="Mekan hakkındaki yorumun..."
                rows="3"
                className="w-full p-5 border-2 border-gray-100 rounded-2xl outline-none focus:border-purple-300"
                value={review.comment}
                onChange={(e) => setReview({ ...review, comment: e.target.value })}
              />
              <button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-black text-lg rounded-3xl flex items-center justify-center gap-3 hover:opacity-90 shadow-xl"
              >
                <Send size={24} /> DENEYİMİMİ KAYDET
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center p-20 bg-white/40 backdrop-blur-sm rounded-[3rem] border-4 border-dashed border-pink-100">
          <p className="text-gray-500 font-bold text-xl uppercase tracking-widest">
            📍 Mekanlara tıkla ve deneyimini paylaş!
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;