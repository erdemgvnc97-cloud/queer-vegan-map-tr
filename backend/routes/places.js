import express from "express";
import { db } from "../firebase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const placesSnap = await db.collection("places").get();
    const reviewsSnap = await db.collection("reviews").get();

    const reviews = reviewsSnap.docs.map(d => d.data());

    const places = placesSnap.docs.map(doc => {
      const place = { id: doc.id, ...doc.data() };

      const placeReviews = reviews.filter(r => r.placeId === doc.id);

      const avg =
        placeReviews.length === 0
          ? 0
          : placeReviews.reduce(
              (sum, r) =>
                sum + (r.queerRespect + r.animalFriendly + r.veganQuality) / 3,
              0
            ) / placeReviews.length;

      return {
        ...place,
        averageScore: Number(avg.toFixed(1)),
      };
    });

    res.json(places);
  } catch (err) {
    console.error("❌ Places alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

export default router;