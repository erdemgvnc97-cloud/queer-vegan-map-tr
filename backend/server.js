import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   FIREBASE INIT
========================= */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

/* =========================
   GET → TÜM MEKANLAR
========================= */
app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const places = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET → MEKAN YORUMLARI
========================= */
app.get("/api/places/:id/reviews", async (req, res) => {
  try {
    const snapshot = await db
      .collection("places")
      .doc(req.params.id)
      .collection("reviews")
      .orderBy("timestamp", "desc")
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   POST → YENİ YORUM
========================= */
app.post("/api/reviews/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    const data = req.body;

    const placeRef = db.collection("places").doc(placeId);
    const placeSnap = await placeRef.get();

    // 🔹 Mekan yoksa oluştur
    if (!placeSnap.exists) {
      await placeRef.set({
        name: data.placeName || "Unnamed place",
        lat: Number(data.lat),
        lng: Number(data.lng),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 🔹 Yorumu ekle
    await placeRef.collection("reviews").add({
      queerRespect: Number(data.queerRespect),
      queerEmployment: Boolean(data.queerEmployment),
      animalFriendly: Number(data.animalFriendly),
      veganQuality: Number(data.veganQuality),
      veganPrice: data.veganPrice, // "ucuz" | "normal" | "pahali"
      employmentExperience: data.employmentExperience || "",
      comment: data.comment || "",
      flag: Boolean(data.flag),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("🚀 Queer Vegan Map Backend is running");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🔥 Backend running on port ${PORT}`)
);
