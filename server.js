const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "Message is required." });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.2,
      max_tokens: 300,
      presence_penalty: 0,
      frequency_penalty: 0,
      messages: [
        {
          role: "system",
          content: `
You are MJCET AI, an official assistant for Muffakham Jah College of Engineering & Technology, Hyderabad.
Answer accurately and concisely based on verified college details like courses, admission, facilities, and contact info.
Avoid generalizations. Quote official info and politely redirect if question is unrelated to MJCET.
          `.trim()
        },
        { role: "user", content: userMessage }
      ],
    });

    const botReply = response.choices?.[0]?.message?.content || "?? No response received.";
    res.json({ reply: botReply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong with the OpenAI API." });
  }
});

app.listen(port, () => {
  console.log(`?? MJCET AI backend running at http://localhost:${port}`);
});
