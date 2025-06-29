const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "? No message provided." });
  }

  try {
    const response = await axios.post("https://api.together.xyz/v1/chat/completions", {
      model: "mistralai/Mistral-7B-Instruct-v0.2", // ? Best for fast & helpful chatbot replies
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for MJ College. Answer questions about admissions, departments, events, campus life, placements, and general student queries."
        },
        {
          role: "user",
          content: userMessage
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const botReply = response.data.choices?.[0]?.message?.content || "?? No reply received.";
    res.json({ reply: botReply });

  } catch (error) {
    console.error("? Together API error:", error.response?.data || error.message);
    res.status(500).json({
      reply: `?? Error: ${error.response?.data?.error?.message || error.message}`
    });
  }
});

app.listen(port, () => {
  console.log(`?? MJ College chatbot backend running at http://localhost:${port}`);
});
