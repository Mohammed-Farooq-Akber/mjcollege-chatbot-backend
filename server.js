const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Route
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          { role: "system", content: "You are a helpful assistant for MJCET college." },
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

    const reply = response.data.choices?.[0]?.message?.content || "?? No reply.";

    // Log for debug
    console.log("? Together AI Response:", reply);

    // Ensure correct encoding
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.json({ reply });
  } catch (error) {
    console.error("? Together AI Error:", error.message);
    res.status(500).json({
      reply: "?? Error: Unable to get response from Together AI."
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`?? Server running on port ${PORT}`);
});
