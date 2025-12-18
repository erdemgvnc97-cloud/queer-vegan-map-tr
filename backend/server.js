import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Yetkilendirme - Hata payını azaltmak için kontrol ekledik
try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error("Firebase başlatma hatası:", error);
}

const db = admin.firestore();

app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // Kritik veri kontrolü
    if (!id || !data.placeName) {
      return res.status(400).json({ error: "Eksik veri gönderildi." });
    }

    const placeRef = db.collection("places").doc(id);
    const doc = await placeRef.get();

    if (!doc.exists) {
      await placeRef.set({
        name: data.placeName,
        lat: parseFloat(data.lat),
        lng: parseFloat(data.lng),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await placeRef.collection("reviews").add({
      nickname: data.nickname || "Anonim",
      queerScore: parseInt(data.queerScore) || 0,
      queerEmployment: data.queerEmployment || "Belirtilmedi",
      veganScore: parseInt(data.veganScore) || 0,
      veganPrice: data.veganPrice || "Belirtilmedi",
      comment: data.comment || "",
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ success: true });
  } catch (err) {
    console.error("🔥 Veritabanı Kayıt Hatası:", err);
    res.status(500).json({ error: "Sunucu hatası: " + err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));