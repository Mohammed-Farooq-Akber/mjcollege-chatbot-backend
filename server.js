// server.js

const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route to handle incoming chat messages from the frontend
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "No message provided." });
  }

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Free model
        messages: [
          {
            role: "system",
            content:
              "You are MJCET AI, a helpful and polite assistant for Muffakham Jah College of Engineering and Technology. Respond clearly and use emojis when needed.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices?.[0]?.message?.content || "?? No response received.";
    res.json({ reply: botReply });

  } catch (err) {
    console.error("Together.ai error:", err.response?.data || err.message);
    res.status(500).json({
      reply: "?? Error: Unable to reach MJCET AI right now. Please try again shortly.",
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`? Server running at http://localhost:${port}`);
});
