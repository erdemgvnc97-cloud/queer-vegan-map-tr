import { useState } from "react";
import axios from "axios";

export default function ReviewForm({ place }) {
  const API_URL = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    nickname: "",
    queerScore: 5,
    queerEmployment: "no",
    animalScore: 5,
    veganScore: 5,
    veganPrice: "normal",
    comment: "",
  });

  const submit = async () => {
    await axios.post(`${API_URL}/api/reviews/${place.id}`, {
      ...form,
      lat: place.lat,
      lng: place.lng,
      placeName: place.name,
    });
    alert("Yorum eklendi 💚");
  };

  return (
    <section className="form">
      <h3>Deneyimini Paylaş</h3>

      <label>Queer bireylere saygı (1–10)</label>
      <input type="range" min="1" max="10"
        value={form.queerScore}
        onChange={e => setForm({ ...form, queerScore: e.target.value })} />

      <label>Queer istihdam var mı?</label>
      <select onChange={e => setForm({ ...form, queerEmployment: e.target.value })}>
        <option value="no">Hayır</option>
        <option value="yes">Evet</option>
      </select>

      <label>Sokak hayvanlarına duyarlılık (1–10)</label>
      <input type="range" min="1" max="10"
        value={form.animalScore}
        onChange={e => setForm({ ...form, animalScore: e.target.value })} />

      <label>Vegan seçenekler (1–10)</label>
      <input type="range" min="1" max="10"
        value={form.veganScore}
        onChange={e => setForm({ ...form, veganScore: e.target.value })} />

      <label>Vegan fiyatlandırma</label>
      <select onChange={e => setForm({ ...form, veganPrice: e.target.value })}>
        <option value="cheap">Ucuz</option>
        <option value="normal">Normal</option>
        <option value="expensive">Pahalı</option>
      </select>

      <label>Yorum</label>
      <textarea
        placeholder="Yaşadıklarını paylaş…"
        onChange={e => setForm({ ...form, comment: e.target.value })}
      />

      <button onClick={submit}>Gönder</button>
    </section>
  );
}
