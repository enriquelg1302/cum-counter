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

function saveData() {
  fs.writeFileSync(FILE, JSON.stringify(counters, null, 2));
}

app.get("/cum", (req, res) => {
  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  if (!u1 || !u2) return res.send("1");

  const key = `${u1}->${u2}`;

  counters[key] = (counters[key] || 0) + 1;

  saveData();

  res.send(String(counters[key]));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running"));
