const express = require("express");
const { OpenAI } = require("openai");

const app = express();
const port = 5000;

// Remplacez par votre clé API
const client = new OpenAI({
    apiKey: "g4a-zJF4KYeXnOtJSeD6wPO8kOcnKMjORJBx4M2",
    baseURL: "https://api.gpt4-all.xyz/v1"
});

app.get("/text", async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) {
        return res.status(400).json({ error: "Missing 'prompt' parameter" });
    }

    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            stream: false,
        });
        res.json({ response: response.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/image", async (req, res) => {
    const prompt = req.query.prompt;
    if (!prompt) {
        return res.status(400).json({ error: "Missing 'prompt' parameter" });
    }

    try {
        const response = await client.images.generate({
            model: "dall-e-3",
            prompt: prompt,
        });
        res.json({ response: response.data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
