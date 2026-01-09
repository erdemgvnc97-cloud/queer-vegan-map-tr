import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { Search, MapPin, Star, X, Filter, ChevronRight } from "lucide-react";

const center = { lat: 39.0, lng: 35.0 };
const libraries = ['places'];
const API = import.meta.env.VITE_API_URL || "";

// Review Modal Component
function ReviewModal({ place, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nickname: "",
    queerRespect: 5,
    queerEmployment: false,
    animalFriendly: 5,
    veganQuality: 5,
    veganPrice: "normal",
    comment: "",
    flag: false,
  });

  useEffect(() => {
    const savedName = localStorage.getItem("nickname");
    if (savedName) setForm((f) => ({ ...f, nickname: savedName }));
  }, []);

  useEffect(() => {
    if (form.nickname) localStorage.setItem("nickname", form.nickname);
  }, [form.nickname]);

  useEffect(() => {
    if (place?.id) {
      fetch(`${API}/api/reviews/${place.id}`)
        .then((res) => res.json())
        .then(setReviews)
        .catch(() => setReviews([]));
    }
  }, [place]);

  if (!place) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/reviews/${place.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          placeName: place.name,
          lat: place.lat,
          lng: place.lng,
        }),
      });
      
      if (response.ok) {
        alert("Yorumun kaydedildi!");
        onClose();
      }
    } catch (err) {
      alert("Bir hata olustu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[3000] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
            {place.address && (
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={14} /> {place.address}
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {reviews.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Onceki Yorumlar</h3>
              {reviews.map((r) => (
                <div key={r.id} className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{r.nickname || "Anonim"}</span>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <Star size={14} fill="currentColor" />
                      <span>{r.queerRespect}/10</span>
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                  {r.flag && <span className="text-xs text-red-600">Sorun bildirildi</span>}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Takma Adin</label>
              <input
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="Ismini veya bir takma ad yaz"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Queer Saygi: {form.queerRespect}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                name="queerRespect"
                value={form.queerRespect}
                onChange={handleChange}
                className="w-full"
                style={{ accentColor: '#9333ea' }}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="queerEmployment"
                checked={form.queerEmployment}
                onChange={handleChange}
                className="w-5 h-5 rounded"
                style={{ accentColor: '#9333ea' }}
              />
              <label className="text-sm font-medium text-gray-700">
                Queer bireyler istihdam ediyorlar mi?
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Hayvan Dostu: {form.animalFriendly}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                name="animalFriendly"
                value={form.animalFriendly}
                onChange={handleChange}
                className="w-full"
                style={{ accentColor: '#16a34a' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vegan Kalite: {form.veganQuality}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                name="veganQuality"
                value={form.veganQuality}
                onChange={handleChange}
                className="w-full"
                style={{ accentColor: '#059669' }}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vegan Fiyatlandirma</label>
              <select
                name="veganPrice"
                value={form.veganPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
              >
                <option value="ucuz">Ucuz</option>
                <option value="normal">Normal</option>
                <option value="pahali">Pahali</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Deneyimini Paylas</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder="Yasadiklarin anlat..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="flag"
                checked={form.flag}
                onChange={handleChange}
                className="w-5 h-5 rounded"
                style={{ accentColor: '#dc2626' }}
              />
              <label className="text-sm font-medium text-gray-700">Bu mekanda sorun yasadim</label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Gonderiliyor..." : "Deneyimi Paylas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Place Card Component
function PlaceCard({ place, isActive, onClick, onReview }) {
  return (
    <div 
      className={`bg-white rounded-2xl p-4 cursor-pointer transition-all hover:shadow-lg border-2 ${
        isActive ? 'border-purple-500 shadow-lg' : 'border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{place.name}</h3>
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
            <MapPin size={12} /> {place.vicinity || place.formatted_address}
          </p>
          {place.averageScore > 0 && (
            <div className="flex items-center gap-1 text-sm text-amber-600">
              <Star size={14} fill="currentColor" />
              <span className="font-semibold">{place.averageScore.toFixed(1)}</span>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReview();
          }}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-200 transition-colors h-fit"
        >
          Yorum Yap
        </button>
      </div>
    </div>
  );
}

// Main Component
export default function MapView() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: libraries,
  });

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [reviewPlace, setReviewPlace] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load places with reviews from backend
  useEffect(() => {
    fetch(`${API}/api/places`)
      .then(res => res.json())
      .then(data => setPlaces(data))
      .catch(err => console.error("Places yuklenemedi:", err));
  }, []);

  // Search nearby places using Google Places API
  const searchNearbyPlaces = (location) => {
    if (!map || !window.google) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: location,
      radius: 5000,
      type: ['restaurant', 'cafe', 'bar'],
      keyword: searchQuery
    };

    setIsSearching(true);
    service.nearbySearch(request, (results, status) => {
      setIsSearching(false);
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const newPlaces = results.map(place => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          vicinity: place.vicinity,
          formatted_address: place.formatted_address,
          averageScore: 0
        }));
        setPlaces(newPlaces);
      }
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (map && searchQuery) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery + ', Turkey' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          map.panTo(location);
          map.setZoom(13);
          searchNearbyPlaces(location);
        }
      });
    }
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    if (map) {
      map.panTo({ lat: place.lat, lng: place.lng });
      map.setZoom(16);
    }
  };

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50 text-red-600 text-xl font-bold">
        Harita yuklenemedi: {loadError.message}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-2xl font-bold">
        Harita yukleniyor...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex">
      {/* Sidebar */}
      <div className="w-[420px] h-full bg-white shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Search Header */}
        <div className="p-6 border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sehir veya mekan ara..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </form>
          <div className="flex items-center gap-2 mt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
              <Filter size={16} />
              Filtrele
            </button>
            <span className="text-sm text-gray-500">{places.length} mekan bulundu</span>
          </div>
        </div>

        {/* Places List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isSearching ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin size={48} className="mx-auto mb-4 text-gray-300" />
              <p>Bir sehir veya mekan ara</p>
            </div>
          ) : (
            places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isActive={selectedPlace?.id === place.id}
                onClick={() => handlePlaceClick(place)}
                onReview={() => setReviewPlace(place)}
              />
            ))
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          center={center}
          zoom={6}
          onLoad={(mapInstance) => setMap(mapInstance)}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            clickableIcons: false,
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
            gestureHandling: 'greedy'
          }}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => handlePlaceClick(place)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: selectedPlace?.id === place.id ? 12 : 8,
                fillColor: selectedPlace?.id === place.id ? '#9333ea' : '#ec4899',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 2,
              }}
            />
          ))}
        </GoogleMap>

        {/* Map Legend */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl flex items-center gap-4 text-sm font-medium">
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            Secili Mekan
          </span>
          <span className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            Diger Mekanlar
          </span>
        </div>
      </div>

      {/* Review Modal */}
      {reviewPlace && (
        <ReviewModal
          place={reviewPlace}
          onClose={() => setReviewPlace(null)}
        />
      )}
    </div>
  );
}
