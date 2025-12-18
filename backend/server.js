import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Yetkilendirme
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}
const db = admin.firestore();

// 1. Mekanları ve Yorumları Çekme
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2. Yeni Deneyim Kaydetme (İstediğin Form Alanları)
app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nickname, 
      queerScore, 
      queerEmployment, 
      veganScore, 
      veganPrice, 
      comment, 
      placeName, 
      lat, 
      lng 
    } = req.body;

    const placeRef = db.collection("places").doc(id);
    const doc = await placeRef.get();

    if (!doc.exists) {
      await placeRef.set({
        name: placeName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await placeRef.collection("reviews").add({
      nickname: nickname || "Anonim",
      queerScore: parseInt(queerScore),
      queerEmployment,
      veganScore: parseInt(veganScore),
      veganPrice,
      comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Kayıt Hatası:", err);
    res.status(500).json({ error: "Kaydedilemedi" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));