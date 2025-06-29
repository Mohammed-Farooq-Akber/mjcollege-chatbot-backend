const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize OpenAI with your API key from Render environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST endpoint to receive user message and get OpenAI reply
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for MJ College." },
        { role: "user", content: userMessage }
      ],
    });

    // Log full response for debugging
    console.log("? OpenAI raw response:", JSON.stringify(response, null, 2));

    // Safely extract bot reply
    const botReply = response.choices?.[0]?.message?.content || "?? No response received.";
    console.log("? Bot reply:", botReply);

    res.json({ reply: botReply });

  } catch (error) {
    console.error("? OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong with the OpenAI API." });
  }
});

// Start server
app.listen(port, () => {
  console.log(`? Server is running at http://localhost:${port}`);
});
