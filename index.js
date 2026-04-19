const express = require("express");
const app = express();

const counters = {};

app.get("/cum", (req, res) => {
  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  if (!u1 || !u2) return res.send("1");

  const key = `${u1}->${u2}`;

  counters[key] = (counters[key] || 0) + 1;

  res.send(String(counters[key]));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running"));
