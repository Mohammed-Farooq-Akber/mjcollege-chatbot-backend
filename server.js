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
You are MJCET AI Assistant, a helpful chatbot for Muffakham Jah College of Engineering & Technology (MJCET), Hyderabad.

Your answers must follow these rules:
- Be short (1–4 sentences)
- Use facts from https://mjcollege.ac.in only
- Greet users politely for casual messages like "hi"
- Avoid unnecessary details unless asked

Avoid hallucinating information or mentioning unrelated colleges.
            `.trim()
          },
          { role: "user", content: userMessage }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "?? No response.";
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ reply });
  } catch (err) {
    console.error("API Error:", err.message); // ? Fixed this line
    res.status(500).json({ reply: "?? Error getting response." });
  }
});

app.listen(PORT, () => {
  console.log(`? MJCET AI backend is running on port ${PORT}`);
});
