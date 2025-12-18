import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Send, ShieldCheck, Briefcase, Leaf, Banknote, Star, Info } from "lucide-react"; // Info buraya eklendi

const LIBRARIES = ["places"];

const mapContainerStyle = {
  height: "45vh",
  width: "100%",
};

const center = { lat: 39.9208, lng: 32.8541 };

const MapView = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState({
    nickname: "", 
    queerScore: 3, 
    queerEmployment: "Hayır",
    veganScore: 3, 
    veganPrice: "Orta", 
    comment: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((mapInstance) => setMap(mapInstance), []);

  useEffect(() => {
    if (isLoaded && API_URL) {
      axios.get(`${API_URL}/api/places`)
        .then((res) => setPlaces(res.data))
        .catch((err) => console.error(err));
    }
  }, [isLoaded, API_URL]);

  const handleMapClick = (e) => {
    if (e.placeId && map) {
      e.stop();
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({ placeId: e.placeId }, (place, status) => {
        if (status === "OK") {
          setSelected({
            id: place.place_id,
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reviews/${selected.id}`, {
        ...review,
        placeName: selected.name,
        lat: selected.lat,
        lng: selected.lng
      });
      alert(`🌈 ${selected.name} deneyimin kaydedildi!`);
      setSelected(null);
      setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
    } catch (err) {
      alert("Hata oluştu 💔");
    }
  };

  if (!isLoaded) return <div className="p-20 text-center text-purple-500 animate-bounce font-bold">Harita Hazırlanıyor...</div>;

  return (
    <div className="max-w-3xl mx-auto px-2 md:px-4 pb-20">
      {/* Harita Kartı */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-8 bg-white h-[45vh]">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onLoad={onLoad}
          onClick={handleMapClick}
          options={{ clickableIcons: true, disableDefaultUI: true, zoomControl: true }}
        >
          {places.map((place) => (
            <Marker key={place.id} position={{ lat: Number(place.lat), lng: Number(place.lng) }} onClick={() => setSelected(place)} />
          ))}
        </GoogleMap>
      </div>

      {/* Dinamik Form Kartı */}
      {selected ? (
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-white/50 animate-in">
          <div className="flex items-center gap-4 mb-8 text-left">
            <div className="p-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl text-white shadow-lg">
              <MapPin size={28} />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-gray-800 leading-tight">{selected.name}</h3>
              <p className="text-purple-500 text-xs font-bold uppercase tracking-wider">Toplulukla Deneyimini Paylaş 🌈</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            {/* Queer Grubu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                  <Star size={16} className="text-purple-500" /> Queer Bireylere Karşı Tutum
                </label>
                <div className="flex items-center gap-4 bg-purple-50 p-4 rounded-2xl border border-purple-100">
                  <input type="range" min="1" max="5" value={review.queerScore} onChange={(e) => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600" />
                  <span className="font-black text-purple-700 text-lg w-4">{review.queerScore}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                  <Briefcase size={16} className="text-purple-500" /> İstihdam Sağlıyor mu?
                </label>
                <div className="flex gap-2">
                  {["Evet", "Hayır"].map((opt) => (
                    <button key={opt} type="button" onClick={() => setReview({...review, queerEmployment: opt})} 
                    className={`flex-1 py-3 rounded-2xl font-bold transition-all ${review.queerEmployment === opt ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-50 text-purple-600'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Vegan Grubu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                  <Leaf size={16} className="text-green-500" /> Vegan Seçenekler Yeterli mi?
                </label>
                <div className="flex items-center gap-4 bg-green-50 p-4 rounded-2xl border border-green-100">
                  <input type="range" min="1" max="5" value={review.veganScore} onChange={(e) => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600" />
                  <span className="font-black text-green-700 text-lg w-4">{review.veganScore}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
                  <Banknote size={16} className="text-green-500" /> Fiyat Ortalaması
                </label>
                <div className="flex gap-2">
                  {["Uygun", "Orta", "Yüksek"].map((p) => (
                    <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                    className={`flex-1 py-2 md:py-3 rounded-xl text-[10px] md:text-xs font-bold transition-all ${review.veganPrice === p ? 'bg-green-600 text-white shadow-md' : 'bg-green-50 text-green-700'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-bold text-gray-700 text-sm ml-1">Deneyimlerin nasıldı?</label>
              <textarea placeholder="Neler yaşadın? Burası güvenli miydi?..." 
              className="w-full p-5 rounded-[1.5rem] md:rounded-[2rem] border-2 border-gray-100 focus:border-pink-300 outline-none min-h-[120px] bg-white/50 transition-all" 
              value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} />
              
              <input type="text" placeholder="Rumuzun (Örn: GezginKedi)" 
              className="w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 border-gray-100 focus:border-pink-300 outline-none bg-white/50" 
              value={review.nickname} onChange={(e) => setReview({...review, nickname: e.target.value})} />
            </div>

            <button type="submit" className="w-full py-5 md:py-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-black text-lg md:text-xl rounded-2xl md:rounded-[2rem] shadow-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              <Send size={24} /> DENEYİMİ KAYDET
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-sm border-4 border-dashed border-pink-200 rounded-[2.5rem] md:rounded-[3rem] p-12 md:p-16 text-center shadow-inner">
          <Info className="mx-auto text-pink-300 mb-4" size={48} />
          <p className="text-gray-500 font-black text-lg md:text-xl uppercase tracking-tighter italic">Bir mekana tıkla ve formu aç!</p>
        </div>
      )}
    </div>
  );
};

export default MapView;