import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    console.log("Istatistik istegi alindi");
    
    const snapshot = await db.collection("reviews").get();
    console.log(`${snapshot.size} adet yorum bulundu`);
    
    const reviews = snapshot.docs.map(d => d.data());

    if (reviews.length === 0) {
      console.log("Hic yorum yok, bos istatistik donuyorum");
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

    const queerRespect = reviews.reduce((sum, r) => sum + (Number(r.queerRespect) || 0), 0) / total;
    const animalFriendly = reviews.reduce((sum, r) => sum + (Number(r.animalFriendly) || 0), 0) / total;
    const veganQuality = reviews.reduce((sum, r) => sum + (Number(r.veganQuality) || 0), 0) / total;

    const queerEmploymentRate =
      (reviews.filter(r => r.queerEmployment === true || r.queerEmployment === "true").length / total) * 100;

    const veganPriceDist = {
      ucuz: reviews.filter(r => r.veganPrice === "ucuz").length,
      normal: reviews.filter(r => r.veganPrice === "normal").length,
      pahali: reviews.filter(r => r.veganPrice === "pahali").length,
    };

    const result = {
      queerRespect: Number(queerRespect.toFixed(1)),
      animalFriendly: Number(animalFriendly.toFixed(1)),
      veganQuality: Number(veganQuality.toFixed(1)),
      queerEmploymentRate: Number(queerEmploymentRate.toFixed(1)),
      veganPriceDist,
      total,
    };

    console.log("Istatistik hesaplandi:", result);
    res.json(result);
    
  } catch (err) {
    console.error("Istatistik hesaplanamadi:", err);
    res.status(500).json({ error: "Sunucu hatasi: " + err.message });
  }
});

export default router;
