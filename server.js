const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("?? Message received:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ reply: "? No message received." });
  }

  try {
    const response = await axios.post("https://api.endpoints.anyscale.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for MJ College." },
        { role: "user", content: userMessage }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${process.env.ANYSCALE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const botReply = response.data.choices?.[0]?.message?.content || "?? No reply received.";
    console.log("? Bot reply:", botReply);
    res.json({ reply: botReply });

  } catch (error) {
    console.error("? Anyscale API error:", error.response?.data || error.message);
    res.status(500).json({
      reply: `?? Error: ${error.response?.data?.error?.message || error.message}`
    });
  }
});

app.listen(port, () => {
  console.log(`?? Server running at http://localhost:${port}`);
});
