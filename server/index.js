import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("Hello from the AI Chatbot server!");
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-001" });
    const result = await model.generateContent(message);

    res.json({ reply: result.response.text() });
  } catch (error) {
    console.error("Error communicating with Gemini API:", error.message);
    res.status(500).json({ error: "Error communicating with Gemini API" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});