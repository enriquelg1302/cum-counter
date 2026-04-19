const express = require("express");
const app = express();

// ================= CONFIG =================
const GITHUB_TOKEN = "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";
const REPO = "enriquelg1302/cum-counter";
const FILE_PATH = "data.json";

// ================= GITHUB GET =================
async function getData() {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "node.js"
      }
    }
  );

  const data = await res.json();

  // Si el archivo no existe aún
  if (!data.content) {
    return { json: {}, sha: data.sha };
  }

  const content = Buffer.from(data.content, "base64").toString("utf8");

  let json;
  try {
    json = JSON.parse(content || "{}");
  } catch (e) {
    json = {};
  }

  return {
    json,
    sha: data.sha
  };
}

// ================= GITHUB SAVE =================
async function saveData(json, sha) {
  await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "node.js",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update counter",
        content: Buffer.from(JSON.stringify(json, null, 2)).toString("base64"),
        sha
      })
    }
  );
}

// ================= ROUTE =================
app.get("/cum", async (req, res) => {
  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  if (!u1 || !u2) {
    return res.send("Debes especificar dos usuarios");
  }

  const key = `${u1}->${u2}`;

  try {
    const { json, sha } = await getData();

    json[key] = (json[key] || 0) + 1;

    await saveData(json, sha);

    const count = json[key];
    const plural = count === 1 ? "vez" : "veces";

    res.send(
      `${u1} se ha venido en ${u2} ${count} ${plural} 💦, que riko 7u7`
    );

  } catch (err) {
    console.error("ERROR:", err);
    res.send("Error al procesar el contador");
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API running on port " + PORT);
});
