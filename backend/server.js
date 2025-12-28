import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import statsRouter from "./routes/stats.js";
import placesRouter from "./routes/places.js";
import reviewsRouter from "./routes/reviews.js";

dotenv.config();

const app = express();

// 🧩 Temel Middleware
app.use(cors());
app.use(express.json());

// ⚠️ API ROUTE'LARI ÖNCE GELMELİ
app.use("/api/stats", statsRouter);
app.use("/api/places", placesRouter);
app.use("/api/reviews", reviewsRouter);

app.get("/api/hello", (req, res) => {
  res.json({ message: "API çalışıyor! 🌱" });
});

// 📁 FRONTEND SERVE - EN SONA
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ⚡️ SPA için tüm route'ları index.html'e yönlendir
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portunda çalışıyor`);
});
