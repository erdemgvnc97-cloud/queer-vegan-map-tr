const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Setup
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

// 📍 Tüm kayıtlı mekanları getir (Haritada markerları göstermek için)
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✍️ Mekan yoksa oluştur ve yorum ekle
app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params; // Google Place ID
    const { 
      nickname, queerScore, queerRespect, 
      veganScore, veganPrice, comment, 
      placeName, lat, lng 
    } = req.body;

    const placeRef = db.collection("places").doc(id);
    const doc = await placeRef.get();

    // Mekan veritabanında yoksa önce mekanı oluştur
    if (!doc.exists) {
      await placeRef.set({
        name: placeName,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // Yorumu (review) alt koleksiyon olarak ekle
    await placeRef.collection("reviews").add({
      nickname: nickname || "Anonim Kedi",
      queerScore: parseInt(queerScore),
      queerRespect,
      veganScore: parseInt(veganScore),
      veganPrice,
      comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true, message: "Deneyim başarıyla kaydedildi! 🌈" });
  } catch (err) {
    console.error("Hata:", err);
    res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));