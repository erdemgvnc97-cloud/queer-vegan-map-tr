import { useEffect, useState } from "react";
import axios from "axios";
import "./PlaceModal.css";

export default function PlaceModal({ place, onClose }) {
  const API_URL = import.meta.env.VITE_API_URL;
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({
    queerScore: 5,
    queerEmployment: "hayır",
    employmentExperience: "",
    animalScore: 5,
    veganScore: 5,
    veganPrice: "normal",
    comment: "",
    flagged: false,
  });

  useEffect(() => {
    axios
      .get(`${API_URL}/api/places/${place.id}/reviews`)
      .then(res => setReviews(res.data));
  }, [place.id]);

  const submit = async () => {
    await axios.post(`${API_URL}/api/reviews/${place.id}`, {
      ...form,
      placeName: place.name,
      lat: place.lat,
      lng: place.lng,
    });
    onClose();
  };

  r
