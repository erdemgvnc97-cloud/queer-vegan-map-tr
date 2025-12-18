import express from "express";
import { db } from "../firebase.js";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const router = express.Router();

router.post("/:placeId", async (req, res) => {
  const data = req.body;

  await addDoc(collection(db, "reviews"), {
    placeId: req.params.placeId,
    ...data,
    createdAt: new Date(),
  });

  res.json({ ok: true });
});

router.get("/:placeId", async (req, res) => {
  const q = query(
    collection(db, "reviews"),
    where("placeId", "==", req.params.placeId)
  );

  const snapshot = await getDocs(q);
  const reviews = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  res.json(reviews);
});

export default router;
