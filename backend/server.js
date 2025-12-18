import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Firebase Başlatma
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

// 📍 Haritadaki noktaları getiren ana rota (404 hatasını çözer)
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(places);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 📍 Seçilen mekanın yorumlarını getiren rota
app.get("/api/places/:id/reviews", async (req, res) => {
  try {
    const snapshot = await db.collection("places").doc(req.params.id)
      .collection("reviews").orderBy("timestamp", "desc").get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 📍 Yeni deneyim kaydetme rotası
app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const placeRef = db.collection("places").doc(id);
    const doc = await placeRef.get();

    if (!doc.exists) {
      await placeRef.set({
        name: data.placeName, lat: parseFloat(data.lat), lng: parseFloat(data.lng),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await placeRef.collection("reviews").add({
      nickname: data.nickname,
      queerScore: parseInt(data.queerScore),
      queerEmployment: data.queerEmployment, // Evet-Hayır alanı
      veganScore: parseInt(data.veganScore),
      veganPrice: data.veganPrice, // Uygun-Orta-Yüksek alanı
      comment: data.comment,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server ready on ${PORT}`));