// frontend/src/components/MapView.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, X, MessageCircle, Send, Star, Leaf, Info } from "lucide-react";

const MapView = () => {
  const libraries = useMemo(() => ["places"], []);
  const center = useMemo(() => ({ lat: 39.92, lng: 32.85 }), []);
  const API_URL = import.meta.env.VITE_API_URL;

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [review, setReview] = useState({
    nickname: "", queerScore: 3, queerEmployment: "Hayır",
    veganScore: 3, veganPrice: "Orta", comment: ""
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const fetchReviews = async (placeId) => {
    try {
      const res = await axios.get(`${API_URL}/api/places/${placeId}/reviews`);
      setSelectedReviews(res.data);
    } catch (err) { setSelectedReviews([]); }
  };

  useEffect(() => {
    if (isLoaded && API_URL) {
      axios.get(`${API_URL}/api/places`).then(res => setPlaces(res.data)).catch(e => console.error(e));
    }
  }, [isLoaded, API_URL]);

  const handleMapClick = (e) => {
    if (e.placeId && map) {
      e.stop();
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({ placeId: e.placeId }, (place, status) => {
        if (status === "OK") {
          const p = { id: place.place_id, name: place.name, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          setSelected(p);
          fetchReviews(p.id);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/reviews/${selected.id}`, { ...review, placeName: selected.name, lat: selected.lat, lng: selected.lng });
      alert("🌈 Deneyim Kaydedildi!");
      fetchReviews(selected.id);
      setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
    } catch (err) { alert("Hata!"); }
  };

  if (!isLoaded) return <div className="h-full flex items-center justify-center font-bold text-gray-400">Harita Hazırlanıyor...</div>;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <GoogleMap 
        mapContainerStyle={{height: "100%", width: "100%"}} 
        center={center} zoom={13} onLoad={setMap} onClick={handleMapClick} 
        options={{ disableDefaultUI: true, zoomControl: true, styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "on" }] }] }}
      >
        {places.map(p => <MarkerF key={p.id} position={{ lat: Number(p.lat), lng: Number(p.lng) }} onClick={() => { setSelected(p); fetchReviews(p.id); }} />)}
      </GoogleMap>

      {selected && (
        <div className="absolute top-0 right-0 w-full md:w-[420px] h-full bg-white/95 backdrop-blur-xl shadow-2xl z-20 overflow-y-auto p-8 border-l border-gray-100 animate-in slide-in-from-right text-left">
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all"><X size={20}/></button>
          
          <div className="mb-8 pt-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-2 block tracking-widest">Mekan Detayı</span>
            <h3 className="text-2xl font-black text-gray-900 leading-tight border-b pb-4">{selected.name}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Queer Bölümü */}
            <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100">
              <label className="block text-xs font-black text-purple-800 mb-4 uppercase flex items-center gap-2">
                <Star size={14} /> Queer Tutum: {review.queerScore}
              </label>
              <input type="range" min="1" max="5" value={review.queerScore} onChange={e => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600 mb-6" />
              <div className="flex gap-2">
                {["Evet", "Hayır"].map(o => (
                  <button key={o} type="button" onClick={() => setReview({...review, queerEmployment: o})} 
                  className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all border-2 ${review.queerEmployment === o ? 'bg-purple-600 text-white border-purple-600 shadow-lg scale-105' : 'bg-white text-purple-600 border-purple-100 hover:border-purple-300'}`}>
                    {o === "Evet" ? "İstihdam Var ✅" : "İstihdam Yok ❌"}
                  </button>
                ))}
              </div>
            </div>

            {/* Vegan Bölümü */}
            <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100">
              <label className="block text-xs font-black text-green-800 mb-4 uppercase flex items-center gap-2">
                <Leaf size={14} /> Vegan Seçenek: {review.veganScore}
              </label>
              <input type="range" min="1" max="5" value={review.veganScore} onChange={e => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600 mb-6" />
              <div className="flex gap-2">
                {["Uygun", "Orta", "Yüksek"].map(p => (
                  <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                  className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border-2 ${review.veganPrice === p ? 'bg-green-600 text-white border-green-600 shadow-lg scale-105' : 'bg-white text-green-700 border-green-100 hover:border-green-300'}`}>
                    {p.toUpperCase()} FİYAT
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <textarea placeholder="Atmosfer, güvenlik ve yemekler nasıldı?..." className="w-full p-6 rounded-[2rem] border-2 border-gray-100 bg-gray-50 focus:border-pink-300 outline-none min-h-[140px] text-sm" value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
              <input type="text" placeholder="Kullanıcı Nickname" className="w-full p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-pink-300 outline-none font-bold text-sm" value={review.nickname} onChange={e => setReview({...review, nickname: e.target.value})} />
            </div>
            
            <button type="submit" className="w-full py-6 bg-black text-white font-black rounded-[2rem] shadow-2xl hover:bg-gray-800 active:scale-95 transition-all text-lg flex items-center justify-center gap-3 tracking-widest">
              DENEYİMİ YAYINLA 🚀
            </button>
          </form>

          {/* Topluluk Sesleri */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h4 className="font-black text-gray-900 mb-8 flex items-center gap-2 uppercase tracking-widest text-xs">
              <MessageCircle size={18} /> Topluluk Deneyimleri ({selectedReviews.length})
            </h4>
            <div className="space-y-8">
              {selectedReviews.length > 0 ? selectedReviews.map((rev, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-pink-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-gray-900 text-sm">@{rev.nickname}</span>
                    <span className="text-[10px] bg-gray-100 px-3 py-1 rounded-full font-bold">Q:{rev.queerScore} V:{rev.veganScore}</span>
                  </div>
                  <p className="text-gray-500 italic leading-relaxed text-sm">"{rev.comment}"</p>
                  <div className="text-[9px] mt-3 text-gray-400 font-black uppercase tracking-tighter">💰 {rev.veganPrice} | 💼 İstihdam: {rev.queerEmployment}</div>
                </div>
              )) : <p className="text-center text-gray-300 py-10 italic">Henüz bir deneyim paylaşılmamış.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;