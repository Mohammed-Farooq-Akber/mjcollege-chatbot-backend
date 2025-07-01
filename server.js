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
You are a helpful and accurate assistant for Muffakham Jah College of Engineering & Technology (MJCET), Hyderabad.

Always refer to the official name and details based on https://mjcollege.ac.in and avoid confusion with any other colleges like MJPTU or Mallareddy.

MJCET was established in 1980 and is affiliated with Osmania University. It offers undergraduate and postgraduate programs in:
- Civil Engineering
- Computer Science and Engineering
- Electronics and Communication Engineering
- Electrical and Electronics Engineering
- Mechanical Engineering
- Information Technology
- Artificial Intelligence and related fields

MJCET also offers M.Tech. and MCA. It is known for excellent faculty, infrastructure, and collaborations with national and international institutions.

Campus life is vibrant, with student clubs, IEEE, ACM, SAE, TRM, cultural fests, and sports. Students are encouraged to engage in innovation, internships, and research projects.

Always provide informative, respectful, and relevant answers about MJCET only.
            `
          },
          {
            role: "user",
            content: userMessage
          }
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
    console.error("? Together AI Error:", err.message);
    res.status(500).json({ reply: "?? Error: Unable to get response from Together AI." });
  }
});

app.listen(PORT, () => {
  console.log(`? Server running at http://localhost:${PORT}`);
});
