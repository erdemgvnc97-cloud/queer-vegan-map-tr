import express from "express";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const router = express.Router();

// 🔹 Yeni yorum kaydı
router.post("/:placeId", async (req, res) => {
  try {
    const data = req.body;

    // 🆕 nickname yoksa varsayılan "Anonim"
    const reviewData = {
      placeId: req.params.placeId,
      nickname: data.nickname || "Anonim",
      queerRespect: data.queerRespect,
      queerEmployment: data.queerEmployment,
      animalFriendly: data.animalFriendly,
      veganQuality: data.veganQuality,
      veganPrice: data.veganPrice,
      comment: data.comment,
      flag: data.flag,
      placeName: data.placeName,
      lat: data.lat,
      lng: data.lng,
      createdAt: new Date(),
    };

    await addDoc(collection(db, "reviews"), reviewData);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Review eklenemedi:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 🔹 Mekana ait yorumları getir
router.get("/:placeId", async (req, res) => {
  try {
    const q = query(
      collection(db, "reviews"),
      where("placeId", "==", req.params.placeId)
    );

    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    res.json(reviews);
  } catch (err) {
    console.error("❌ Yorumlar çekilemedi:", err);
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
});

// 🆕 🔹 Tüm yorumları getir (istatistik sayfası için)
router.get("/all", async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "reviews"));
    const reviews = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    res.json(reviews);
  } catch (err) {
    console.error("❌ Tüm yorumlar alınamadı:", err);
    res.status(500).json({ error: "Veri çekme hatası" });
  }
});


export default router;
