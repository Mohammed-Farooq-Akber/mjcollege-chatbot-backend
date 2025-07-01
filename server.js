const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
You are a helpful and accurate assistant for Muffakham Jah College of Engineering & Technology (MJCET), Hyderabad.

Your response must follow these rules:
- Keep answers short and clear (2–5 sentences max)
- Use bullet points if listing more than 2 items
- Stick to the official college info from https://mjcollege.ac.in
- Avoid long paragraphs unless explicitly asked
- Be friendly, professional, and concise

Never mention or confuse MJCET with other colleges like MJPTU or Mallareddy. Always refer to MJCET's official name and offerings.
            `.trim()
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "?? No response received.";
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ reply });
  } catch (err) {
    console.error("? Together API Error:", err.message);
    res.status(500).json({ reply: "?? Error: Unable to get response from AI." });
  }
});

app.listen(PORT, () => {
  console.log(`? MJCET AI Backend running on http://localhost:${PORT}`);
});
