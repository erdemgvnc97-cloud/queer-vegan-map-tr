import express from "express";
import { db } from "../firebase.js";
import { collection, getDocs } from "firebase/firestore";

const router = express.Router();

router.get("/", async (req, res) => {
  const placesSnap = await getDocs(collection(db, "places"));
  const reviewsSnap = await getDocs(collection(db, "reviews"));

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
});

export default router;
