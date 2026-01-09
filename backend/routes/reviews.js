import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

router.post("/:placeId", async (req, res) => {
  try {
    const data = req.body;
    console.log("Yeni yorum kaydediliyor:", data);

    const reviewData = {
      placeId: req.params.placeId,
      nickname: data.nickname || "Anonim",
      queerRespect: Number(data.queerRespect) || 5,
      queerEmployment: data.queerEmployment === true || data.queerEmployment === "true",
      animalFriendly: Number(data.animalFriendly) || 5,
      veganQuality: Number(data.veganQuality) || 5,
      veganPrice: data.veganPrice || "normal",
      comment: data.comment || "",
      flag: data.flag === true || data.flag === "true",
      placeName: data.placeName || "",
      lat: Number(data.lat) || 0,
      lng: Number(data.lng) || 0,
      createdAt: new Date(),
    };

    const docRef = await db.collection("reviews").add(reviewData);
    console.log("Yorum kaydedildi, ID:", docRef.id);
    
    res.json({ ok: true, id: docRef.id });
  } catch (err) {
    console.error("Review eklenemedi:", err);
    res.status(500).json({ error: "Sunucu hatasi: " + err.message });
  }
});

router.get("/:placeId", async (req, res) => {
  try {
    console.log("Yorumlar getiriliyor, placeId:", req.params.placeId);
    
    const snapshot = await db.collection("reviews")
      .where("placeId", "==", req.params.placeId)
      .orderBy("createdAt", "desc")
      .get();

    const reviews = snapshot.docs.map((d) => ({ 
      id: d.id, 
      ...d.data(),
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || null
    }));
    
    console.log(`${reviews.length} adet yorum bulundu`);
    res.json(reviews);
  } catch (err) {
    console.error("Yorumlar cekilemedi:", err);
    res.status(500).json({ error: "Yorumlar alinamadi: " + err.message });
  }
});

export default router;
