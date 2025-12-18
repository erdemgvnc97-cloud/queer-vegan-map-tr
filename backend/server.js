import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Kurulumu [cite: 8, 9]
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Private key içindeki \n karakterlerini gerçek satır sonlarına dönüştürür [cite: 9]
      privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }),
  });
}

const db = admin.firestore();

// 📍 Tüm kayıtlı mekanları getir [cite: 10]
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) {
    console.error("🔥 Hata:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✍️ Mekan yoksa oluştur ve yorum ekle [cite: 11]
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
    console.error("❌ Hata:", err);
    res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
});

const PORT = process.env.PORT || 8080; [cite: 12]
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`)); [cite: 12]