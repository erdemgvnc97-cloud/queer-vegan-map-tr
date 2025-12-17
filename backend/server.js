import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json"));
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

app.get("/api/places", async (req, res) => {
  try {
    const snapshot = await db.collection("places").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error("🔥 Error fetching places:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = req.body;
    await db.collection("places").doc(id).collection("reviews").add(review);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error posting review:", err);
    res.status(500).json({ error: "Could not save review" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(\`✅ Backend running on port \${PORT}\`));
