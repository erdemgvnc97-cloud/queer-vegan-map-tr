import React, { useState, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import { MapPin, Send, ShieldCheck, Leaf, Info } from "lucide-react";

const mapContainerStyle = {
  height: "70vh",
  width: "100%",
  borderRadius: "30px",
};
const center = { lat: 39.9208, lng: 32.8541 }; // Ankara Merkez

const MapView = () => {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [review, setReview] = useState({
    nickname: "",
    queerScore: 5,
    queerRespect: "Hayır ✨",
    veganScore: 5,
    veganPrice: "Normal ⚖️",
    comment: "",
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // KRİTİK: Google Places kütüphanesini yükler
  });

  // Veritabanındaki önceden yorumlanmış mekanları çek
  useEffect(() => {
    if (isLoaded) {
      axios.get(`${API_URL}/api/places`)
        .then((res) => setPlaces(res.data))
        .catch((err) => console.error("Veri çekme hatası:", err));
    }
  }, [isLoaded, API_URL]);

  // Haritadaki herhangi bir mekana (POI) tıklandığında çalışan fonksiyon
  const handleMapClick = (e) => {
    if (e.placeId) {
      e.stop(); // Google'ın varsayılan penceresini kapat
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({ placeId: e.placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
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
      alert(`🌈 ${selected.name} hakkındaki deneyimin topluluğa ulaştı!`);
      setSelected(null);
      setReview({ nickname: "", queerScore: 5, queerRespect: "Hayır ✨", veganScore: 5, veganPrice: "Normal ⚖️", comment: "" });
      
      // Listeyi güncellemek için tekrar veri çek
      const res = await axios.get(`${API_URL}/api/places`);
      setPlaces(res.data);
    } catch (err) {
      alert("Bir hata oluştu, lütfen tekrar dene 💔");
    }
  };

  if (!isLoaded) return <div className="p-20 text-center font-bold text-purple-500 animate-bounce">Harita Hazırlanıyor... 🏳️‍🌈</div>;

  return (
    <div className="space-y-10">
      <div className="relative shadow-2xl rounded-[40px] overflow-hidden border-8 border-white">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          onClick={handleMapClick}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: [/* Buraya istersen harita stilini (dark/light/pastel) ekleyebiliriz */]
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: Number(place.lat), lng: Number(place.lng) }}
              onClick={() => setSelected(place)}
              icon="https://maps.google.com/mapfiles/ms/icons/pink-dot.png"
            />
          ))}
        </GoogleMap>
      </div>

      {selected ? (
        <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border-2 border-fuchsia-100 animate-in slide-in-from-bottom-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl text-white shadow-lg">
              <MapPin size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-800">{selected.name}</h3>
              <p className="text-fuchsia-500 font-semibold tracking-wide uppercase text-xs">Yeni Deneyim Paylaş 🌈</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Queer Dostluk Bölümü */}
            <div className="space-y-6 p-6 bg-purple-50 rounded-3xl">
              <h4 className="flex items-center gap-2 font-bold text-purple-800"><ShieldCheck size={20}/> Queer Güvenliği</h4>
              <label className="block">
                <span className="text-sm text-gray-600 block mb-2">Saygısızlık/Ayrımcılık yaşandı mı?</span>
                <select 
                  className="w-full p-4 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-purple-400"
                  value={review.queerRespect}
                  onChange={(e) => setReview({...review, queerRespect: e.target.value})}
                >
                  <option>Hayır ✨</option>
                  <option>Evet ⚠️ (Lütfen yorumda detay verin)</option>
                </select>
              </label>
            </div>

            {/* Vegan Bölümü */}
            <div className="space-y-6 p-6 bg-green-50 rounded-3xl">
              <h4 className="flex items-center gap-2 font-bold text-green-800"><Leaf size={20}/> Vegan Seçenek</h4>
              <label className="block">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Seçenek Bolluğu</span>
                  <span className="font-bold">{review.veganScore}/10</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={review.veganScore} 
                  onChange={(e) => setReview({...review, veganScore: e.target.value})}
                  className="w-full accent-green-600"
                />
              </label>
            </div>

            <div className="md:col-span-2 space-y-4">
              <input 
                type="text" placeholder="Rumuzun (Örn: queer_gezgin)"
                className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-fuchsia-300 outline-none"
                value={review.nickname}
                onChange={(e) => setReview({...review, nickname: e.target.value})}
              />
              <textarea 
                placeholder="Mekan hakkında neler söylemek istersin? Çalışanların tavrı, ortamın enerjisi..."
                className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-fuchsia-300 outline-none"
                rows="4"
                value={review.comment}
                onChange={(e) => setReview({...review, comment: e.target.value})}
              />
              <button type="submit" className="w-full py-6 bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white font-black text-xl rounded-2xl shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all">
                DENEYİMİ SİTEYE EKLE 🚀
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center p-16 bg-white/50 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-pink-200">
          <Info className="mx-auto text-pink-300 mb-4" size={48} />
          <p className="text-gray-500 font-black text-2xl">HARİTADAKİ HERHANGİ BİR MEKANA TIKLA!</p>
          <p className="text-gray-400 mt-2 font-medium italic text-lg">"Koru Starbucks, yerel bir bar veya bir kitabevi..."</p>
        </div>
      )}
    </div>
  );
};

export default MapView;