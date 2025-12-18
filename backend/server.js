import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Kurulumu
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const db = admin.firestore();

// Kayıtlı mekanları getir
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mekan/Yorum kaydet
app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nickname, queerScore, queerRespect, 
      veganScore, veganPrice, comment, 
      placeName, lat, lng 
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
      nickname: nickname || "Anonim Kedi",
      queerScore: parseInt(queerScore),
      queerRespect,
      veganScore: parseInt(veganScore),
      veganPrice,
      comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Sunucu hatası." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));