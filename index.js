const express = require("express");
const fs = require("fs");

const app = express();
const FILE = "data.json";

// Cargar datos si existen
let counters = {};

if (fs.existsSync(FILE)) {
  try {
    counters = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch (e) {
    counters = {};
  }
}

// Guardar datos en archivo
function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(counters, null, 2));
}

app.get("/cum", (req, res) => {
  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  // Validación básica
  if (!u1 || !u2) {
    return res.send("Debes especificar dos usuarios");
  }

  // Clave única por combinación
  const key = `${u1}->${u2}`;

  // Incrementar contador
  counters[key] = (counters[key] || 0) + 1;

  // Guardar en archivo
  saveData();

  // Formato de salida
  const count = counters[key];
  const plural = count === 1 ? "vez" : "veces";

  res.send(`${u1} se ha venido en ${u2} ${count} ${plural} 💦, que riko 7u7`);
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});
