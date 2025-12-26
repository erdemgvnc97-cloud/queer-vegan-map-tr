import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("reviews").get();
    const reviews = snapshot.docs.map(d => d.data());

    if (reviews.length === 0) {
      return res.json({
        queerRespect: 0,
        queerEmploymentRate: 0,
        animalFriendly: 0,
        veganQuality: 0,
        veganPriceDist: { ucuz: 0, normal: 0, pahali: 0 },
        total: 0,
      });
    }

    const total = reviews.length;

    const queerRespect = reviews.reduce((sum, r) => sum + (r.queerRespect || 0), 0) / total;
    const animalFriendly = reviews.reduce((sum, r) => sum + (r.animalFriendly || 0), 0) / total;
    const veganQuality = reviews.reduce((sum, r) => sum + (r.veganQuality || 0), 0) / total;

    const queerEmploymentRate =
      (reviews.filter(r => r.queerEmployment).length / total) * 100;

    const veganPriceDist = {
      ucuz: reviews.filter(r => r.veganPrice === "ucuz").length,
      normal: reviews.filter(r => r.veganPrice === "normal").length,
      pahali: reviews.filter(r => r.veganPrice === "pahali").length,
    };

    res.json({
      queerRespect: Number(queerRespect.toFixed(1)),
      animalFriendly: Number(animalFriendly.toFixed(1)),
      veganQuality: Number(veganQuality.toFixed(1)),
      queerEmploymentRate: Number(queerEmploymentRate.toFixed(1)),
      veganPriceDist,
      total,
    });
  } catch (err) {
    console.error("❌ İstatistik hesaplanamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;