import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

// 🔹 Yeni yorum kaydı
router.post("/:placeId", async (req, res) => {
  try {
    const data = req.body;

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

    await db.collection("reviews").add(reviewData);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Review eklenemedi:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

// 🔹 Mekana ait yorumları getir
router.get("/:placeId", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews")
      .where("placeId", "==", req.params.placeId)
      .get();

    const reviews = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json(reviews);
  } catch (err) {
    console.error("❌ Yorumlar çekilemedi:", err);
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
});

// 🔹 Tüm yorumları getir
router.get("/all", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews").get();
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