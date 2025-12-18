import { useEffect, useState } from "react";
import "./PlaceModal.css";

const API = import.meta.env.VITE_API_URL;

export default function PlaceModal({ place, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    queerRespect: 5,
    queerEmployment: false,
    animalFriendly: 5,
    veganQuality: 5,
    veganPrice: "normal",
    employmentExperience: "",
    comment: "",
    flag: false,
  });

  useEffect(() => {
    fetch(`${API}/api/places/${place.id}/reviews`)
      .then(res => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [place, API]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(p => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

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
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="close" onClick={onClose}>×</button>

        <h2>{place.name}</h2>

        {reviews.length > 0 && (
          <div className="reviews">
            {reviews.map(r => (
              <div className="review" key={r.id}>
                <strong>Queer saygı:</strong> {r.queerRespect}/10{" "}
                {r.flag && "🚩"}
                <div>{r.comment}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Queer bireylere saygı
            <input type="range" min="1" max="10" name="queerRespect" onChange={handleChange} />
          </label>

          <label>
            Queer istihdam
            <input type="checkbox" name="queerEmployment" onChange={handleChange} />
          </label>

          <label>
            Sokak hayvanlarına duyarlılık
            <input type="range" min="1" max="10" name="animalFriendly" onChange={handleChange} />
          </label>

          <label>
            Vegan seçenekler
            <input type="range" min="1" max="10" name="veganQuality" onChange={handleChange} />
          </label>

          <label>
            Vegan fiyatlandırma
            <select name="veganPrice" onChange={handleChange}>
              <option value="ucuz">Ucuz</option>
              <option value="normal">Normal</option>
              <option value="pahali">Pahalı</option>
            </select>
          </label>

          <label>
            İstihdam / deneyim
            <textarea name="comment" onChange={handleChange} />
          </label>

          <label className="flag">
            <input type="checkbox" name="flag" onChange={handleChange} />
            Bu mekanda sorun yaşadım
          </label>

          <button>Deneyimi Paylaş</button>
        </form>
      </div>
    </div>
  );
}
