const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI with API key (from Render environment variables)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  console.log("?? Incoming message:", userMessage);

  if (!userMessage) {
    return res.status(400).json({ reply: "? No message received from user." });
  }

  try {
    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant for MJ College." },
        { role: "user", content: userMessage },
      ],
    });

    console.log("? OpenAI raw response:", JSON.stringify(response, null, 2));

    let botReply;
    try {
      botReply = response.choices[0].message.content;
    } catch (extractErr) {
      console.error("?? Error extracting content:", extractErr);
      botReply = "?? Unable to extract response from OpenAI.";
    }

    res.json({ reply: botReply });

  } catch (error) {
    console.error("? OpenAI API error:", error);

    res.status(500).json({
      reply: `?? OpenAI API Error: ${error.message || "Unknown error"}`
    });
  }
});

app.listen(port, () => {
  console.log(`?? Server running on http://localhost:${port}`);
});
