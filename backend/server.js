// backend/server.js
// 📍 Belirli bir mekanın yorumlarını getir
app.get("/api/places/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const snapshot = await db.collection("places").doc(id).collection("reviews")
      .orderBy("timestamp", "desc") // En yeni yorum en üstte
      .get();
    
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});