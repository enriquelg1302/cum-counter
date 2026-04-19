const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();

// ================= CONFIG =================
const URI = "mongodb+srv://admin:admin@cluster0.ervvyrs.mongodb.net/?appName=Cluster0"; // 🔴 cámbialo si es necesario
const DB_NAME = "twitchbot";
const COLLECTION = "counters";

let db;

// ================= CONEXIÓN =================
async function connectDB() {
  try {
    const client = new MongoClient(URI);
    await client.connect();

    db = client.db(DB_NAME);
    console.log("✅ MongoDB conectado correctamente");
  } catch (err) {
    console.error("❌ Error conectando MongoDB:", err);
  }
}

// ================= ROUTE =================
app.get("/cum", async (req, res) => {
  if (!db) {
    return res.send("⏳ Base de datos no lista aún");
  }

  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  if (!u1 || !u2) {
    return res.send("Debes especificar dos usuarios");
  }

  const key = `${u1}->${u2}`;

  try {
    const collection = db.collection(COLLECTION);

    // 🔥 INCREMENTO SEGURO (ATÓMICO)
    await collection.updateOne(
      { _id: key },
      { $inc: { count: 1 } },
      { upsert: true }
    );

    // 🔍 leer el valor actualizado
    const doc = await collection.findOne({ _id: key });
    const count = doc?.count || 1;

    const plural = count === 1 ? "vez" : "veces";

    res.send(
      `${u1} se ha venido en ${u2} ${count} ${plural} 💦, que rico 7u7`
    );

  } catch (err) {
    console.error("❌ Error en /cum:", err);
    res.send("Error al procesar el contador");
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

// 🔥 IMPORTANTE: esperar conexión antes de levantar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 API corriendo en puerto ${PORT}`);
  });
});
