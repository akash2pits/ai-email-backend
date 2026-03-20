import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.post("/rewrite", async (req, res) => {

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Write a professional email reply." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No reply generated"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }

});

app.listen(3000, () => {
  console.log("AI Email Server running on port 3000");
});