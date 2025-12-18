import { useEffect, useState } from "react";
import "./PlaceModal.css";

const API = import.meta.env.VITE_API_URL;

export default function PlaceModal({ place, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    queerRespect: 5,
    queerEmployment: false,
    animalFriendly: 5,
    veganQuality: 5,
    veganPrice: "normal",
    comment: "",
    flag: false,
  });

  // 🔹 Modal kapalıysa hiçbir şey render etme
  if (!place) return null;

  // 🔹 Mevcut yorumları çek
  useEffect(() => {
    fetch(`${API}/api/places/${place.id}/reviews`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [place]);

  // 🔹 Form input handler
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // 🔹 Form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${API}/api/reviews/${place.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          placeName: place.name,
          lat: place.lat,
          lng: place.lng,
        }),
      });

      onClose();
    } catch (err) {
      alert("Bir hata oluştu 😿");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close" onClick={onClose}>
          ×
        </button>

        <h2>{place.name}</h2>

        {/* 🔹 Önceki Yorumlar */}
        {reviews.length > 0 && (
          <div className="reviews">
            {reviews.map((r) => (
              <div className="review" key={r.id}>
                <strong>Queer saygı:</strong> {r.queerRespect}/10{" "}
                {r.flag && "🚩"}
                {r.comment && <div>{r.comment}</div>}
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Yorum Formu */}
        <form onSubmit={handleSubmit}>
          <label>
            Queer bireylere saygı
            <input
              type="range"
              min="1"
              max="10"
              name="queerRespect"
              value={form.queerRespect}
              onChange={handleChange}
            />
          </label>

          <label>
            Queer istihdam var mı?
            <input
              type="checkbox"
              name="queerEmployment"
              checked={form.queerEmployment}
              onChange={handleChange}
            />
          </label>

          <label>
            Sokak hayvanlarına duyarlılık
            <input
              type="range"
              min="1"
              max="10"
              name="animalFriendly"
              value={form.animalFriendly}
              onChange={handleChange}
            />
          </label>

          <label>
            Vegan seçenekler
            <input
              type="range"
              min="1"
              max="10"
              name="veganQuality"
              value={form.veganQuality}
              onChange={handleChange}
            />
          </label>

          <label>
            Vegan fiyatlandırma
            <select
              name="veganPrice"
              value={form.veganPrice}
              onChange={handleChange}
            >
              <option value="ucuz">Ucuz</option>
              <option value="normal">Normal</option>
              <option value="pahali">Pahalı</option>
            </select>
          </label>

          <label>
            Deneyimini yaz
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              placeholder="Yaşadığını paylaş…"
            />
          </label>

          <label className="flag">
            <input
              type="checkbox"
              name="flag"
              checked={form.flag}
              onChange={handleChange}
            />
            Bu mekanda sorun yaşadım
          </label>

          <button disabled={loading}>
            {loading ? "Gönderiliyor…" : "Deneyimi Paylaş"}
          </button>
        </form>
      </div>
    </div>
  );
}
