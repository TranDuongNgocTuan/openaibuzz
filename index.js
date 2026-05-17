const express = require("express");
const cors = require("cors");
const askAI = require("./openaibuzz");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await askAI(prompt);
    res.json({ response: aiResponse });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Server running");
});