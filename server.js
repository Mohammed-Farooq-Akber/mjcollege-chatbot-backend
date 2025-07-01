const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend from 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

// POST /chat – Handles chat requests
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: `
You are MJCET AI Assistant. Provide helpful, accurate, and concise answers only related to Muffakham Jah College of Engineering and Technology (MJCET), Hyderabad based on info from https://mjcollege.ac.in.

- Do not mention any other colleges (e.g., Mallareddy).
- Greet briefly if the user says "hi", "hello", etc.
- Give short answers (1-4 sentences).
- Avoid long lists unless asked specifically.
`.trim()
          },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "?? No response.";
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ reply });
  } catch (err) {
    console.error("API Error:", err.message);
    res.status(500).json({ reply: "?? Error getting response from AI." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`? Server running at http://localhost:${PORT}`);
});
