const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// POST endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("?? Incoming message:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ reply: "? No message received from user." });
  }

  try {
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
      model: "openai/gpt-3.5-turbo", // you can change to other models like anthropic/claude-3-sonnet
      messages: [
        { role: "system", content: "You are a helpful assistant for MJ College." },
        { role: "user", content: userMessage },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mjcollege.ac.in", // required by OpenRouter
        "Content-Type": "application/json"
      }
    });

    const botReply = response.data.choices?.[0]?.message?.content || "?? No reply received.";
    console.log("? Bot reply:", botReply);
    res.json({ reply: botReply });

  } catch (error) {
    console.error("? OpenRouter API error:", error.response?.data || error.message);
    res.status(500).json({
      reply: `?? OpenRouter Error: ${error.response?.data?.error?.message || error.message}`
    });
  }
});

app.listen(port, () => {
  console.log(`?? Server running at http://localhost:${port}`);
});
