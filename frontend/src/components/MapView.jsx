import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Info, Star, Briefcase, Leaf, Banknote, Send, MessageCircle } from "lucide-react";

const LIBRARIES = ["places"];
const mapContainerStyle = { height: "45vh", width: "100%" };
const center = { lat: 39.9208, lng: 32.8541 };

const MapView = () => {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]); // Geçmiş yorumlar için
  const [review, setReview] = useState({
    nickname: "", 
    queerScore: 3, 
    queerEmployment: "Hayır",
    veganScore: 3, 
    veganPrice: "Orta", 
    comment: ""
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((m) => setMap(m), []);

  // Haritadaki kayıtlı işaretçileri çek
  useEffect(() => {
    if (isLoaded && API_URL) {
      axios.get(`${API_URL}/api/places`).then(res => setPlaces(res.data));
    }
  }, [isLoaded, API_URL]);

  const handleMapClick = (e) => {
    if (e.placeId && map) {
      e.stop();
      const service = new window.google.maps.places.PlacesService(map);
      service.getDetails({ placeId: e.placeId }, (place, status) => {
        if (status === "OK") {
          const placeData = { id: place.place_id, name: place.name, lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
          setSelected(placeData);
          
          // 📥 Seçilen mekanın geçmiş yorumlarını çek
          axios.get(`${API_URL}/api/places/${place.place_id}/reviews`)
            .then(res => setSelectedReviews(res.data))
            .catch(() => setSelectedReviews([]));
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/reviews/${selected.id}`, {
        ...review,
        placeName: selected.name,
        lat: selected.lat,
        lng: selected.lng
      });
      if (res.data.success) {
        alert("🌈 Deneyim kaydedildi!");
        // Yorum listesini anında güncelle
        setSelectedReviews([{ ...review, timestamp: new Date() }, ...selectedReviews]);
        setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
      }
    } catch (err) { alert("Hata oluştu! Lütfen tekrar dene."); }
  };

  if (!isLoaded) return <div className="p-10 text-center font-bold">Harita Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto p-2 md:p-4 pb-20">
      {/* Harita */}
      <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white mb-6 h-[40vh]">
        <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={13} onLoad={onLoad} onClick={handleMapClick} options={{ clickableIcons: true, disableDefaultUI: true, zoomControl: true }}>
          {places.map(p => <MarkerF key={p.id} position={{ lat: Number(p.lat), lng: Number(p.lng) }} onClick={() => setSelected(p)} />)}
        </GoogleMap>
      </div>

      {selected ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 transition-all">
          {/* Mekan Bilgi Kartı ve Form */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-2xl border border-pink-50 text-left">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <MapPin className="text-pink-500" />
              <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">{selected.name}</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Queer Tutum */}
              <div className="bg-purple-50 p-5 rounded-3xl">
                <label className="block text-sm font-bold text-purple-800 mb-3">Queer bireylere karşı tutum nasıl? (1-5)</label>
                <div className="flex gap-4 items-center">
                  <input type="range" min="1" max="5" value={review.queerScore} onChange={e => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="font-black text-purple-700 text-xl">{review.queerScore}</span>
                </div>
              </div>

              {/* İstihdam - Butonlar artık renk değiştiriyor */}
              <div className="bg-purple-50 p-5 rounded-3xl">
                <label className="block text-sm font-bold text-purple-800 mb-3 font-bold">Mekan queer bireylere istihdam sağlıyor mu?</label>
                <div className="flex gap-3">
                  {["Evet", "Hayır"].map(o => (
                    <button key={o} type="button" onClick={() => setReview({...review, queerEmployment: o})} 
                      className={`flex-1 py-3 rounded-2xl font-black transition-all border-2 ${review.queerEmployment === o ? 'bg-purple-600 text-white border-purple-600 shadow-lg' : 'bg-white text-purple-600 border-purple-200'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vegan Seçenekler */}
              <div className="bg-green-50 p-5 rounded-3xl">
                <label className="block text-sm font-bold text-green-800 mb-3 font-bold">Vegan seçenekler yeterli mi? (1-5)</label>
                <div className="flex gap-4 items-center">
                  <input type="range" min="1" max="5" value={review.veganScore} onChange={e => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer" />
                  <span className="font-black text-green-700 text-xl">{review.veganScore}</span>
                </div>
              </div>

              {/* Fiyat Ortalaması - Butonlar artık renk değiştiriyor */}
              <div className="bg-green-50 p-5 rounded-3xl">
                <label className="block text-sm font-bold text-green-800 mb-3 font-bold">Vegan seçeneklerin fiyat ortalaması nasıl?</label>
                <div className="flex gap-2">
                  {["Uygun", "Orta", "Yüksek"].map(p => (
                    <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                      className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border-2 ${review.veganPrice === p ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-white text-green-700 border-green-200'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <textarea placeholder="Deneyimlerin nasıldı?..." className="w-full p-5 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-pink-300 min-h-[120px] text-sm bg-gray-50/50" value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
                <input type="text" placeholder="Kullanıcı Nickname:" className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-pink-300 bg-gray-50/50 font-bold" value={review.nickname} onChange={e => setReview({...review, nickname: e.target.value})} />
              </div>

              <button type="submit" className="w-full py-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-black rounded-[2rem] shadow-xl hover:shadow-pink-200 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                <Send size={24} /> DENEYİMİ KAYDET
              </button>
            </form>
          </div>

          {/* Geçmiş Yorumlar Bölümü */}
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] shadow-xl border border-white">
            <h4 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <MessageCircle className="text-pink-500" /> TOPLULUK DENEYİMLERİ ({selectedReviews.length})
            </h4>
            <div className="space-y-4">
              {selectedReviews.length > 0 ? (
                selectedReviews.map((rev, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-pink-50 shadow-sm text-left">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-purple-700">@{rev.nickname}</span>
                      <div className="flex gap-1">
                        <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Queer: {rev.queerScore}</span>
                        <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Vegan: {rev.veganScore}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm italic">"{rev.comment}"</p>
                    <div className="mt-3 flex gap-3 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                      <span>💰 {rev.veganPrice}</span>
                      <span>💼 İstihdam: {rev.queerEmployment}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-10 text-gray-400 font-bold italic">Henüz yorum yok. İlk sen yaz! 🏳️‍🌈</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white/40 backdrop-blur-md border-4 border-dashed border-pink-200 rounded-[3rem] text-center shadow-inner">
          <Info className="mx-auto text-pink-300 mb-3 shadow-sm" size={48} />
          <p className="text-gray-500 font-black text-xl uppercase italic tracking-tighter">Bir mekana tıkla ve topluluğa katıl!</p>
        </div>
      )}
    </div>
  );
};

export default MapView;