const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key (store in Render's environment variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Never hardcode your API key
});

// Endpoint for chatbot
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ error: "Something went wrong with OpenAI API." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`? Server running at http://localhost:${port}`);
});
