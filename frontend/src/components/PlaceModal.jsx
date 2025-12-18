import "./PlaceModal.css";

export default function PlaceModal({ place, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{place.name}</h2>
        <p>{place.address}</p>

        <form>
          <label>
            Queer bireylere saygı (1–10)
            <input type="number" min="1" max="10" />
          </label>

          <label>
            Queer istihdamı var mı?
            <select>
              <option>Evet</option>
              <option>Hayır</option>
            </select>
          </label>

          <label>
            Yorum
            <textarea />
          </label>

          <button type="submit">Gönder</button>
        </form>
      </div>
    </div>
  );
}
