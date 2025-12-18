import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/* 📍 Mekanlar */
app.get("/api/places", async (_, res) => {
  const snap = await db.collection("places").get();
  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* 📍 Yorumlar */
app.get("/api/places/:id/reviews", async (req, res) => {
  const snap = await db
    .collection("places")
    .doc(req.params.id)
    .collection("reviews")
    .orderBy("timestamp", "desc")
    .get();

  res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
});

/* ✍️ Yeni Yorum */
app.post("/api/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const placeRef = db.collection("places").doc(id);
  const placeDoc = await placeRef.get();

  if (!placeDoc.exists) {
    await placeRef.set({
      name: data.placeName,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 🛡️ Basit spam önlemi
  if (!data.comment || data.comment.length < 10) {
    return res.status(400).json({ error: "Yorum çok kısa" });
  }

  await placeRef.collection("reviews").add({
    nickname: data.nickname || "Anonim",
    queerScore: Number(data.queerScore),
    queerEmployment: data.queerEmployment,
    employmentExperience: data.employmentExperience || null,
    animalScore: Number(data.animalScore),
    veganScore: Number(data.veganScore),
    veganPrice: data.veganPrice,
    flagged: data.flagged || false,
    comment: data.comment,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  res.json({ success: true });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("🚀 Backend ready"));
