import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, X, MessageCircle, Send } from "lucide-react";

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

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-purple-400">Harita Hazırlanıyor...</div>;

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden">
      <GoogleMap mapContainerStyle={{height:"100%", width:"100%"}} center={center} zoom={13} onLoad={setMap} onClick={handleMapClick} options={{ disableDefaultUI: true, zoomControl: true }}>
        {places.map(p => <MarkerF key={p.id} position={{ lat: Number(p.lat), lng: Number(p.lng) }} onClick={() => { setSelected(p); fetchReviews(p.id); }} />)}
      </GoogleMap>

      {selected && (
        <div className="absolute top-0 right-0 w-full md:w-[420px] h-full bg-white/95 backdrop-blur-md shadow-2xl z-20 overflow-y-auto p-8 border-l animate-in slide-in-from-right">
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"><X size={20}/></button>
          
          <h3 className="text-2xl font-black mb-8 mt-6 border-b pb-4 text-gray-800 tracking-tighter uppercase">{selected.name}</h3>

          <form onSubmit={handleSubmit} className="space-y-8 text-left">
            <div className="bg-purple-50 p-5 rounded-[2rem]">
              <label className="block text-xs font-black text-purple-800 mb-4 uppercase">Queer Tutum Puanı: {review.queerScore}</label>
              <input type="range" min="1" max="5" value={review.queerScore} onChange={e => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600 mb-6" />
              <div className="flex gap-2">
                {["Evet", "Hayır"].map(o => (
                  <button key={o} type="button" onClick={() => setReview({...review, queerEmployment: o})} 
                  className={`flex-1 py-3 rounded-2xl font-black border-2 transition-all ${review.queerEmployment === o ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-purple-600 border-purple-100'}`}>{o}</button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-5 rounded-[2rem]">
              <label className="block text-xs font-black text-green-800 mb-4 uppercase">Vegan Seçenek Puanı: {review.veganScore}</label>
              <input type="range" min="1" max="5" value={review.veganScore} onChange={e => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600 mb-6" />
              <div className="flex gap-2">
                {["Uygun", "Orta", "Yüksek"].map(p => (
                  <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${review.veganPrice === p ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-green-700 border-green-100'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-left">
              <label className="block text-xs font-black text-gray-400 uppercase ml-2">Deneyimlerin nasıldı?</label>
              <textarea placeholder="Atmosfer, güven ve yemekler..." className="w-full p-6 rounded-[2rem] border-2 border-gray-100 min-h-[140px] text-sm bg-gray-50 focus:border-pink-300 outline-none" value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
              
              <label className="block text-xs font-black text-gray-400 uppercase ml-2">Kullanıcı Nickname:</label>
              <input type="text" placeholder="İsminiz" className="w-full p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-pink-300 outline-none font-bold" value={review.nickname} onChange={e => setReview({...review, nickname: e.target.value})} />
            </div>
            
            <button type="submit" className="w-full py-6 bg-black text-white font-black rounded-[2rem] shadow-xl hover:bg-gray-800 active:scale-95 transition-all">YAYINLA 🚀</button>
          </form>

          {/* Geçmiş Yorumlar Listesi */}
          <div className="mt-12 pt-8 border-t text-left">
            <h4 className="font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs"><MessageCircle size={20}/> Topluluk Sesleri ({selectedReviews.length})</h4>
            <div className="space-y-6">
              {selectedReviews.map((rev, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative pl-6 border-l-4 border-l-pink-400">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-black text-purple-700">@{rev.nickname}</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold">Q:{rev.queerScore} V:{rev.veganScore}</span>
                  </div>
                  <p className="text-gray-600 italic leading-relaxed text-sm">"{rev.comment}"</p>
                  <div className="text-[9px] mt-4 text-gray-400 font-black uppercase tracking-tighter">💰 {rev.veganPrice} | 💼 İstihdam: {rev.queerEmployment}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;