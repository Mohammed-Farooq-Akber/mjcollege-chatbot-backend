const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key from Render environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  // Log the incoming message
  console.log("?? User message received:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for MJ College." },
        { role: "user", content: userMessage },
      ],
    });

    // Log the full response for debugging
    console.log("? FULL OpenAI response:");
    console.dir(response, { depth: null });

    // Try extracting the reply
    let botReply;
    try {
      botReply = response.choices[0].message.content;
    } catch (e) {
      console.error("?? Couldn't extract bot reply:", e);
      botReply = "?? Failed to extract reply from OpenAI.";
    }

    // Send the reply back to frontend
    res.json({ reply: botReply });

  } catch (error) {
    console.error("? OpenAI API error:", error);
    res.status(500).json({ reply: "?? Bot error. Try again later." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`? Server running at http://localhost:${port}`);
});
