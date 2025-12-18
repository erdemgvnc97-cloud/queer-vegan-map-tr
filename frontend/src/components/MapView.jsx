import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Info, Star, Briefcase, Leaf, Banknote, Send, MessageCircle, X } from "lucide-react";

const LIBRARIES = ["places"];
const mapContainerStyle = { height: "100%", width: "100%" };
const center = { lat: 39.9208, lng: 32.8541 };

// Harita Stilini Sadeleştiriyoruz (Opsiyonel: Daha temiz görünüm için)
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  clickableIcons: true,
  styles: [
    { featureType: "poi.business", elementType: "labels", stylers: [{ visibility: "on" }] },
    { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] }
  ]
};

const MapView = () => {
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
    libraries: LIBRARIES,
  });

  // Mekanın yorumlarını getiren fonksiyon (Tekrar kullanabilmek için dışarı aldık)
  const fetchReviews = async (placeId) => {
    try {
      const res = await axios.get(`${API_URL}/api/places/${placeId}/reviews`);
      setSelectedReviews(res.data);
    } catch (err) {
      setSelectedReviews([]);
    }
  };

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
          const placeData = { 
            id: place.place_id, 
            name: place.name, 
            lat: place.geometry.location.lat(), 
            lng: place.geometry.location.lng() 
          };
          setSelected(placeData);
          fetchReviews(place.place_id); // Mekana tıklandığında yorumları çek
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
        fetchReviews(selected.id); // Kayıttan sonra listeyi yenile
        setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
      }
    } catch (err) { alert("Hata oluştu!"); }
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Harita Hazırlanıyor...</div>;

  return (
    <div className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-gray-50">
      
      {/* Harita Katmanı */}
      <div className="absolute inset-0 z-0">
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={center} 
          zoom={13} 
          onLoad={(m) => setMap(m)} 
          onClick={handleMapClick} 
          options={mapOptions}
        >
          {places.map(p => (
            <MarkerF key={p.id} position={{ lat: Number(p.lat), lng: Number(p.lng) }} onClick={() => {
              setSelected(p);
              fetchReviews(p.id);
            }} />
          ))}
        </GoogleMap>
      </div>

      {/* Modern Side Panel / Form Overlay */}
      {selected && (
        <div className="absolute inset-0 z-10 flex flex-col items-end pointer-events-none">
          <div className="w-full md:w-[450px] h-full bg-white/95 backdrop-blur-md shadow-2xl pointer-events-auto overflow-y-auto animate-in slide-in-from-right duration-300 border-l border-gray-100">
            
            {/* Panel Kapatma Butonu */}
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all">
              <X size={20} className="text-gray-500" />
            </button>

            <div className="p-8">
              <div className="mb-10 pt-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-2 block">Mekan Detayı</span>
                <h3 className="text-3xl font-black text-gray-900 leading-tight">{selected.name}</h3>
              </div>

              {/* Deneyim Yazma Formu */}
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <section>
                  <h4 className="text-xs font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Star size={14} /> Queer Deneyimi
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-purple-50/50 p-6 rounded-[2rem] border border-purple-100">
                      <p className="text-xs font-bold text-purple-800 mb-4">Queer tutum puanı: <span className="text-lg ml-1">{review.queerScore}</span></p>
                      <input type="range" min="1" max="5" value={review.queerScore} onChange={e => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600 cursor-pointer" />
                    </div>
                    <div className="flex gap-2">
                      {["Evet", "Hayır"].map(o => (
                        <button key={o} type="button" onClick={() => setReview({...review, queerEmployment: o})} 
                          className={`flex-1 py-4 rounded-2xl font-black transition-all text-sm ${review.queerEmployment === o ? 'bg-purple-600 text-white shadow-xl' : 'bg-white border-2 border-purple-100 text-purple-600'}`}>
                          {o === "Evet" ? "İstihdam Var ✅" : "İstihdam Yok ❌"}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-black uppercase text-gray-400 mb-4 flex items-center gap-2">
                    <Leaf size={14} /> Vegan Deneyimi
                  </h4>
                  <div className="space-y-6">
                    <div className="bg-green-50/50 p-6 rounded-[2rem] border border-green-100">
                      <p className="text-xs font-bold text-green-800 mb-4">Vegan seçenek puanı: <span className="text-lg ml-1">{review.veganScore}</span></p>
                      <input type="range" min="1" max="5" value={review.veganScore} onChange={e => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600 cursor-pointer" />
                    </div>
                    <div className="flex gap-2">
                      {["Uygun", "Orta", "Yüksek"].map(p => (
                        <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} 
                          className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border-2 ${review.veganPrice === p ? 'bg-green-600 text-white border-green-600 shadow-lg' : 'bg-white text-green-700 border-green-100'}`}>
                          {p.toUpperCase()} FİYAT
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <div className="space-y-4">
                  <textarea placeholder="Atmosfer nasıldı? Güvende hissettin mi?..." className="w-full p-6 rounded-[2rem] border-2 border-gray-100 outline-none focus:border-pink-300 min-h-[140px] text-sm bg-gray-50" value={review.comment} onChange={e => setReview({...review, comment: e.target.value})} />
                  <input type="text" placeholder="Kullanıcı Nickname" className="w-full p-5 rounded-2xl border-2 border-gray-100 outline-none focus:border-pink-300 font-bold text-sm" value={review.nickname} onChange={e => setReview({...review, nickname: e.target.value})} />
                </div>

                <button type="submit" className="w-full py-6 bg-black text-white font-black rounded-[2rem] shadow-2xl hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                  DENEYİMİ YAYINLA
                </button>
              </form>

              {/* Geçmiş Yorumlar - Tasarımı sadeleştirildi */}
              <div className="mt-16 pt-10 border-t border-gray-100">
                <h4 className="text-sm font-black text-gray-900 mb-8 flex items-center gap-2 uppercase tracking-widest">
                  <MessageCircle size={18} /> Topluluk Sesleri ({selectedReviews.length})
                </h4>
                <div className="space-y-8">
                  {selectedReviews.length > 0 ? (
                    selectedReviews.map((rev, idx) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-pink-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-black text-gray-900">@{rev.nickname}</span>
                          <span className="text-[10px] text-gray-400 font-bold">• {new Date(rev.timestamp?.seconds * 1000).toLocaleDateString('tr-TR')}</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">"{rev.comment}"</p>
                        <div className="flex gap-2">
                          <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">Q: {rev.queerScore}</span>
                          <span className="bg-gray-100 text-gray-600 text-[9px] font-black px-3 py-1 rounded-full uppercase">V: {rev.veganScore}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-300 font-bold italic text-sm">Henüz kimse bir şey yazmamış.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mekan Seçilmediğinde Görünen Küçük İpucu Balonu */}
      {!selected && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-[280px] bg-black text-white p-4 rounded-3xl shadow-2xl text-center animate-bounce">
          <p className="text-[11px] font-black uppercase tracking-widest">Haritadan bir yer seç ve başla! 📍</p>
        </div>
      )}
    </div>
  );
};

export default MapView;