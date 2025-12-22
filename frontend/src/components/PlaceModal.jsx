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
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>

        <h2>{place.name}</h2>

        {/* 🔹 Önceki Yorumlar */}
        {reviews.length > 0 && (
          <div className="reviews">
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  background: "rgba(255,255,255,0.8)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <strong style={{ color: "#222", fontSize: "0.95rem" }}>
                    {r.nickname || "Anonim"}
                  </strong>
                  {r.flag && <span style={{ fontSize: "1.2rem" }}>🚩</span>}
                </div>

                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#333",
                    lineHeight: "1.4",
                  }}
                >
                  <div>
                    🏳️‍🌈 Queer Saygı: <strong>{r.queerRespect}</strong>/10
                  </div>
                  <div>
                    💼 Queer İstihdam: {r.queerEmployment ? "Evet" : "Hayır"}
                  </div>
                  <div>
                    🐾 Hayvan Dostu: <strong>{r.animalFriendly}</strong>/10
                  </div>
                  <div>
                    🥗 Vegan Seçenek: <strong>{r.veganQuality}</strong>/10
                  </div>
                  <div>💸 Fiyat: {r.veganPrice}</div>

                  {r.comment && (
                    <div
                      style={{
                        marginTop: "8px",
                        background: "rgba(255,255,255,0.5)",
                        borderRadius: "8px",
                        padding: "8px",
                        fontStyle: "italic",
                        color: "#444",
                      }}
                    >
                      “{r.comment}”
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Yorum Formu */}
        <form onSubmit={handleSubmit}>
          <label>
            Queer bireylere karşı saygılı davrandılar mı?
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
            Queer bireyler istihdam ediyorlar mı?
            <input
              type="checkbox"
              name="queerEmployment"
              checked={form.queerEmployment}
              onChange={handleChange}
            />
          </label>

          <label>
            Sokak hayvanlarına duyarlılıkları nasıl?
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
            Vegan seçenekler yeterli mi?
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
            Vegan fiyatlandırma nasıl?
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
