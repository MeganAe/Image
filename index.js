const express = require("express");
const { fal } = require("@fal-ai/client");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;
const FAL_API_KEY = "5bc94134-46b7-40f6-b4b0-3be3e131117a:585abd893ed441ae5a30ca208f84816c";

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

    const imageUrl = result.data;

    // Télécharger l'image générée
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, "images", `${Date.now()}.jpg`);

    // Sauvegarder l'image localement
    fs.writeFileSync(imagePath, imageResponse.data);

    // Retourner l'URL de l'image sur votre serveur
    res.json({
      imageUrl: `http://localhost:${PORT}/images/${path.basename(imagePath)}`,
      requestId: result.requestId,
    });
  } catch (error) {
    console.error("Erreur lors de la génération d’image :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});

// Servir les images stockées localement
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
