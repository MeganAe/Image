const express = require("express");
const { fal } = require("@fal-ai/client");

const app = express();
const PORT = 3000;
const FAL_API_KEY = "5bc94134-46b7-40f6-b4b0-3be3e131117a:585abd893ed441ae5a30ca208f84816c"; // Remplace par ta vraie clé API

fal.config({ credentials: FAL_API_KEY });

app.get("/image", async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Le paramètre 'prompt' est requis." });
    }

    const result = await fal.subscribe("fal-ai/fast-sdxl", {
      input: { prompt },
      logs: true,
    });

    // Extraire l'URL de l'image générée
    const imageUrl = result.data;

    // Renvoi uniquement l'URL de l'image dans la réponse
    res.json({ imageUrl });
  } catch (error) {
    console.error("Erreur lors de la génération d’image :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
