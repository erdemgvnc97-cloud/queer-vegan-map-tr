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
      <div className="shadow-xl border border-pink-100 overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={6}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelected(place)}
            />
          ))}
        </GoogleMap>
      </div>

      {selected ? (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-fuchsia-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-pink-100 rounded-2xl text-pink-600">
              <MapPin size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold">{selected.name}</h3>
              <p className="text-slate-500 italic">Deneyimini paylaş 💬</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Queer Soruları */}
            <div className="p-6 bg-purple-50 rounded-3xl border space-y-6">
              <h4 className="flex items-center gap-2 font-bold text-purple-700 text-lg">
                <ShieldCheck /> Queer Dostluk
              </h4>
              <label className="block">
                <span className="font-semibold text-sm">
                  Queer Dostu mu? (1–10)
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={review.queerScore}
                  onChange={(e) =>
                    setReview({ ...review, queerScore: e.target.value })
                  }
                  className="w-full accent-purple-500 mt-2"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-sm">
                  Saygısızlık yaşandı mı?
                </span>
                <select
                  className="w-full mt-2 p-3 border rounded-xl"
                  value={review.queerRespect}
                  onChange={(e) =>
                    setReview({ ...review, queerRespect: e.target.value })
                  }
                >
                  <option>Hayır</option>
                  <option>Evet</option>
                </select>
              </label>
            </div>

            {/* Vegan Soruları */}
            <div className="p-6 bg-green-50 rounded-3xl border space-y-6">
              <h4 className="flex items-center gap-2 font-bold text-green-700 text-lg">
                <Leaf /> Vegan Seçenekler
              </h4>
              <label className="block">
                <span className="font-semibold text-sm">
                  Seçenek yeterliliği (1–10)
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={review.veganScore}
                  onChange={(e) =>
                    setReview({ ...review, veganScore: e.target.value })
                  }
                  className="w-full accent-green-500 mt-2"
                />
              </label>
              <label className="block">
                <span className="font-semibold text-sm">
                  Vegan seçeneklerin fiyatı?
                </span>
                <select
                  className="w-full mt-2 p-3 border rounded-xl"
                  value={review.veganPrice}
                  onChange={(e) =>
                    setReview({ ...review, veganPrice: e.target.value })
                  }
                >
                  <option>Normal</option>
                  <option>Pahalı</option>
                  <option>Uygun</option>
                </select>
              </label>
            </div>

            <div className="md:col-span-2 space-y-4">
              <input
                type="text"
                placeholder="Rumuzun (örn: anonim_kedi)"
                className="w-full p-4 border rounded-2xl"
                value={review.nickname}
                onChange={(e) =>
                  setReview({ ...review, nickname: e.target.value })
                }
              />
              <textarea
                placeholder="Deneyimini anlat..."
                rows="4"
                className="w-full p-4 border rounded-2xl"
                value={review.comment}
                onChange={(e) =>
                  setReview({ ...review, comment: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <Send size={20} /> Deneyimimi Kaydet
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center p-10 bg-white/70 rounded-[40px] border-2 border-dashed border-pink-100">
          <p className="text-slate-500 font-medium">
            🌍 Bir mekan seçerek yorum yapabilirsin!
          </p>
        </div>
      )}
    </div>
  );
};

export default MapView;