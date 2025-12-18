import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api"; // MarkerF kullanımı önerilir
import axios from "axios";
import { MapPin, Info } from "lucide-react";

const LIBRARIES = ["places"];
const mapContainerStyle = { height: "45vh", width: "100%" };
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
      axios.get(`${API_URL}/api/places`).then((res) => setPlaces(res.data)).catch(e => console.log(e));
    }
  }, [isLoaded, API_URL]);

  const handleMapClick = (e) => {
    if (e.placeId && map) {
      e.stop();
      // Yeni 'Place' kütüphanesine geçiş uyarısına rağmen mevcut yapı en kararlı olandır
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
      const response = await axios.post(`${API_URL}/api/reviews/${selected.id}`, {
        ...review,
        placeName: selected.name,
        lat: selected.lat,
        lng: selected.lng
      });
      
      if (response.data.success) {
        alert(`🌈 ${selected.name} deneyimin kaydedildi!`);
        setSelected(null);
        setReview({ nickname: "", queerScore: 3, queerEmployment: "Hayır", veganScore: 3, veganPrice: "Orta", comment: "" });
      }
    } catch (err) {
      console.error("Gönderim hatası:", err);
      alert("Kayıt sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
    }
  };

  if (!isLoaded) return <div className="p-20 text-center font-bold">Harita Yükleniyor...</div>;

  return (
    <div className="max-w-3xl mx-auto px-2 pb-20">
      <div className="rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white mb-6 bg-white h-[45vh]">
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={center} 
          zoom={13} 
          onLoad={onLoad} 
          onClick={handleMapClick} 
          options={{ clickableIcons: true, disableDefaultUI: true, zoomControl: true }}
        >
          {places.map((p) => (
            <MarkerF 
              key={p.id} 
              position={{ lat: Number(p.lat), lng: Number(p.lng) }} 
              onClick={() => setSelected(p)} 
            />
          ))}
        </GoogleMap>
      </div>

      {selected ? (
        <div className="bg-white/95 rounded-[2.5rem] p-6 shadow-2xl border border-pink-100 text-left">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-pink-500 rounded-xl text-white"><MapPin size={24} /></div>
            <h3 className="text-xl font-black text-gray-800">{selected.name}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-2xl">
              <label className="block font-bold text-purple-800 text-sm mb-2">Queer bireylere karşı tutum nasıl? (1-5)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="5" value={review.queerScore} onChange={(e) => setReview({...review, queerScore: e.target.value})} className="w-full accent-purple-600" />
                <span className="font-black text-purple-700">{review.queerScore}</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-2xl">
              <label className="block font-bold text-purple-800 text-sm mb-2">Mekan queer bireylere istihdam sağlıyor mu?</label>
              <div className="flex gap-2">
                {["Evet", "Hayır"].map((opt) => (
                  <button key={opt} type="button" onClick={() => setReview({...review, queerEmployment: opt})} className={`flex-1 py-3 rounded-xl font-bold transition-all ${review.queerEmployment === opt ? 'bg-purple-600 text-white' : 'bg-white text-purple-600'}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl">
              <label className="block font-bold text-green-800 text-sm mb-2">Vegan seçenekler yeterli mi? (1-5)</label>
              <div className="flex items-center gap-4">
                <input type="range" min="1" max="5" value={review.veganScore} onChange={(e) => setReview({...review, veganScore: e.target.value})} className="w-full accent-green-600" />
                <span className="font-black text-green-700">{review.veganScore}</span>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl">
              <label className="block font-bold text-green-800 text-sm mb-2">Vegan seçeneklerin fiyat ortalaması nasıl?</label>
              <div className="flex gap-2">
                {["Uygun", "Orta", "Yüksek"].map((p) => (
                  <button key={p} type="button" onClick={() => setReview({...review, veganPrice: p})} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${review.veganPrice === p ? 'bg-green-600 text-white' : 'bg-white text-green-700'}`}>{p}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block font-bold text-gray-700 text-sm">Deneyimlerin nasıldı?</label>
              <textarea placeholder="Deneyimini anlat..." className="w-full p-4 rounded-2xl border-2 border-gray-100 outline-none focus:border-pink-300 min-h-[100px]" value={review.comment} onChange={(e) => setReview({...review, comment: e.target.value})} />
              <label className="block font-bold text-gray-700 text-sm">Kullanıcı Nickname:</label>
              <input type="text" placeholder="İsminiz" className="w-full p-4 rounded-xl border-2 border-gray-100 outline-none focus:border-pink-300" value={review.nickname} onChange={(e) => setReview({...review, nickname: e.target.value})} />
            </div>

            <button type="submit" className="w-full py-5 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-all">DENEYİMİ KAYDET 🚀</button>
          </form>
        </div>
      ) : (
        <div className="p-12 bg-white/50 border-4 border-dashed border-pink-200 rounded-[2.5rem] text-center">
          <Info className="mx-auto text-pink-300 mb-2" size={40} />
          <p className="text-gray-500 font-bold uppercase italic">Bir mekana tıkla ve deneyimini paylaş!</p>
        </div>
      )}
    </div>
  );
};

export default MapView;