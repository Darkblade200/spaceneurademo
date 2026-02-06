// 🔑 Load .env FIRST (must be top line)
import "dotenv/config";

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===============================
   MODEL → API KEY MAP
   (matches frontend EXACTLY)
================================ */
const MODEL_KEYS = {
  "qwen/qwen-2.5-72b-instruct": process.env.OR_KEY_QWEN,
  "google/gemma-2-9b-it": process.env.OR_KEY_GEMMA,
  "deepseek/deepseek-r1": process.env.OR_KEY_DEEPSEEK
};

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("Intellify backend running");
});

/* ===============================
   CHAT ENDPOINT
================================ */
app.post("/chat", async (req, res) => {
  try {
    const { model, messages } = req.body;

    console.log("CHAT HIT");
    console.log("MODEL:", model);

    if (!model || !messages) {
      return res.status(400).json({ error: "Missing model or messages" });
    }

    const apiKey = MODEL_KEYS[model];
    console.log("KEY FOUND:", Boolean(apiKey));

    if (!apiKey) {
      return res.status(403).json({
        error: "Model not allowed or API key missing",
        model
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages,
          stream: false
        })
      }
    );

    console.log("OPENROUTER STATUS:", response.status);

    const data = await response.json();

    if (!response.ok) {
      console.error("OPENROUTER ERROR:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Backend proxy failure" });
  }
});

/* ===============================
   START SERVER
================================ */
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log("ENV CHECK →", {
    DEEPSEEK: !!process.env.OR_KEY_DEEPSEEK,
    GEMMA: !!process.env.OR_KEY_GEMMA,
    QWEN: !!process.env.OR_KEY_QWEN
  });
});
