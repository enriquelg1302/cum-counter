const express = require("express");
const fetch = require("node-fetch");

const app = express();

const GITHUB_TOKEN = "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";
const REPO = "enriquelg1302/cum-counter";
const FILE_PATH = "data.json";

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
  const content = Buffer.from(data.content, "base64").toString();
  return { data: JSON.parse(content), sha: data.sha };
}

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

app.get("/cum", async (req, res) => {
  let u1 = (req.query.u1 || "").trim().toLowerCase();
  let u2 = (req.query.u2 || "").trim().toLowerCase();

  if (!u1 || !u2) return res.send("1");

  const key = `${u1}->${u2}`;

  const { data, sha } = await getData();

  data[key] = (data[key] || 0) + 1;

  await saveData(data, sha);

  const count = data[key];
  const plural = count === 1 ? "vez" : "veces";

  res.send(`${u1} se ha venido en ${u2} ${count} ${plural} 💦, que riko 7u7`);
});

app.listen(3000);
