const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // you can change model here
        messages: [
          {
            role: "system",
            content: `You are MJCET AI, an official assistant for Muffakham Jah College of Engineering & Technology (MJCET), Hyderabad. Be precise, factual, and helpful.`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "?? No reply received.";
    res.json({ reply });

  } catch (err) {
    console.error("TogetherAI error:", err?.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch from TogetherAI." });
  }
});

app.listen(port, () => {
  console.log(`? MJCET AI backend running on http://localhost:${port}`);
});
