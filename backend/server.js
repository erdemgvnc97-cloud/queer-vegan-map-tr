import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();

// 🧩 Temel Middleware
app.use(cors());
app.use(express.json());
app.use("/api/stats", statsRouter);


// 📍 API örneği (kendi endpoint'lerin burada kalabilir)
app.get("/api/hello", (req, res) => {
  res.json({ message: "API çalışıyor! 🌱" });
});

// 📁 FRONTEND SERVE AYARLARI
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🟢 Vite ile oluşturulan dosyaları statik olarak sun
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ⚡️ Tüm diğer route'lar frontend'e yönlendiriliyor
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// 🚀 PORT AYARI (Render ortam değişkeni veya local)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server ${PORT} portunda çalışıyor`);
});
