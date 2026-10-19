import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  // Increase payload size for base64 image uploads
  app.use(express.json({ limit: '10mb' }));

  // API Route for Gemini (Farming Assistant)
  app.post("/api/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured. Please add it in the settings." });
      }

      const { message, language } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are Kisan Mitra, an AI farming assistant. Help the farmer with their query. Keep it concise, practical, and friendly. Please respond in the following language: ${language || 'English'}. Query: ${message}`,
      });
      res.json({ reply: response.text });
    } catch (error: any) {
      const isApiKeyError = [400, 401, 403].includes(error?.status) || error?.message?.includes("API key");
      if (!isApiKeyError) {
        console.error("AI Error:", error);
      }
      const errorMessage = isApiKeyError 
        ? "Invalid or missing Gemini API key. Please check your settings."
        : "Failed to fetch response from AI.";
      res.status(500).json({ error: errorMessage });
    }
  });

  // API Route for Crop Disease Detection (Gemini Vision)
  app.post("/api/analyze-crop", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API key is not configured. Please add it in the settings." });
      }

      const { image, language } = req.body; // image is a base64 string
      if (!image) {
        return res.status(400).json({ error: "No image provided" });
      }

      // Remove data URI prefix if present (e.g., "data:image/jpeg;base64,")
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          `You are an expert agronomist. Analyze this image of a crop. Identify the crop if possible, detect any visible diseases or pests, and provide actionable recommendations for treatment or care. Please respond in the following language: ${language || 'English'}. Keep your response structured and easy to read.`,
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
        ],
      });
      res.json({ result: response.text });
    } catch (error: any) {
      const isApiKeyError = [400, 401, 403].includes(error?.status) || error?.message?.includes("API key");
      if (!isApiKeyError) {
        console.error("AI Vision Error:", error);
      }
      const errorMessage = isApiKeyError 
        ? "Invalid or missing Gemini API key. Please check your settings."
        : "Failed to analyze the crop image.";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Mock API Route for Weather Data
  app.get("/api/weather", (req, res) => {
    // In a real app, you would proxy to OpenWeather API here
    // e.g. fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    res.json({
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      forecast: [
        { day: "Mon", temp: 29 },
        { day: "Tue", temp: 31 },
        { day: "Wed", temp: 27 },
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
