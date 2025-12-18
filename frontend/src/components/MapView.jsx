// frontend/src/components/MapView.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, X, MessageCircle, Send } from "lucide-react";

const MapView = () => {
  const libraries = useMemo(() => ["places"], []);
  const center = useMemo(() => ({ lat: 39.92, lng: 32.85 }), []);
  
  // ÖNEMLİ: Harita yüksekliğini burada sabitliyoruz
  const mapContainerStyle = { 
    height: "100%", 
    width: "100%",
    minHeight: "500px" // Dar görünmeyi engelleyen kritik satır
  };

  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [review, setReview] = useState({
    nickname: "", queerScore: 3, queerEmployment: "Hayır",
    veganScore: 3, veganPrice: "Orta", comment: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;
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
      await axios.post(`${API_URL}/api/reviews/${selected.id}`, { 
        ...review, 
        placeName: selected.name, 
        lat: selected.lat, 
        lng: selected.lng 
      });
      alert("🌈 Kaydedildi!");
      fetchReviews(selected.id);
      setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
    } catch (err) { alert("Hata!"); }
  };

  if (!isLoaded) return <div className="h-[500px] flex items-center justify-center font-bold">Harita Hazırlanıyor...</div>;

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-[2rem]">
      {/* Harita */}
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        center={center} 
        zoom={13} 
        onLoad={setMap} 
        onClick={handleMapClick} 
        options={{ disableDefaultUI: true, zoomControl: true }}
      >
        {places.map(p => (
          <MarkerF 
            key={p.id} 
            position={{ lat: Number(p.lat), lng: Number(p.lng) }} 
            onClick={() => { setSelected(p); fetchReviews(p.id); }} 
          />
        ))}
      </GoogleMap>

      {/* Yan Panel (Side Panel) */}
      {selected && (
        <div className="absolute top-0 right-0 w-full md:w-[380px] h-full bg-white/95 backdrop-blur-md shadow-2xl z-20 overflow-y-auto p-6 animate-in slide-in-from-right border-l text-left">
          <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all">
            <X size={20}/>
          </button>
          
          <h3 className="text-xl font-black mb-6 mt-4 border-b pb-4 text-gray-800 uppercase tracking-tighter">
            {selected.name}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-purple-800 mb-2 uppercase">Queer Tutum: {review.queerScore}</label>
              <input type="range" min="1" max="5" value={review.queerScore} onChange={e => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600 mb-4" />
              <div className="flex gap-2">
                {["Evet", "Hayır"].map(o => (
                  <button key={o} type="button" onClick={() => setReview({...review, queerEmployment: o})} 
                  className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${review.queerEmployment === o ? 'bg-purple-600 text-white border-purple-600 shadow-md' : 'bg-white text-purple-600 border-purple-100'}`}>
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl">
              <label className="block text-xs font-bold text-green-800 mb-2 uppercase">Vegan Seçenek: {review.veganScore}</label>
              <input type="range" min="1" max="5" value={review.veganScore} onChange={e => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600 mb-4" />
              <div className="flex gap-2">
                {["Uygun", "Orta", "Yüksek"].map(p => (
                  <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold border-2 transition-all ${review.veganPrice === p ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-green-700 border-green-100'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <textarea placeholder="Deneyimlerin..." className="w-full p-4 rounded-2xl border-2 border-gray-100 min-h-[100px] text-sm" value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
              <input type="text" placeholder="Kullanıcı Nickname" className="w-full p-4 rounded-xl border-2 border-gray-100 font-bold" value={review.nickname} onChange={e => setReview({...review, nickname: e.target.value})} />
            </div>
            <button type="submit" className="w-full py-5 bg-black text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-95 transition-all">
              <Send size={18}/> KAYDET
            </button>
          </form>

          {/* Topluluk Deneyimleri Bölümü */}
          <div className="mt-10 border-t pt-6">
            <h4 className="font-black text-gray-800 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
              <MessageCircle size={18}/> Topluluk Deneyimleri ({selectedReviews.length})
            </h4>
            <div className="space-y-4">
              {selectedReviews.map((rev, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm relative border-l-4 border-l-pink-400">
                  <div className="flex justify-between font-bold text-purple-700 mb-2">
                    <span>@{rev.nickname}</span>
                    <span>Q:{rev.queerScore} V:{rev.veganScore}</span>
                  </div>
                  <p className="text-gray-600 italic">"{rev.comment}"</p>
                  <div className="text-[10px] mt-3 text-gray-400 font-bold uppercase">
                    💰 {rev.veganPrice} | 💼 İstihdam: {rev.queerEmployment}
                  </div>
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