import express from 'express';
import axios from 'axios';

const router = express.Router();

/* -----------------------------------------------
   💬 QUOTE ROUTE
   GET /api/quote
   - Fetches a random motivational quote from ZenQuotes API
------------------------------------------------ */
router.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://zenquotes.io/api/random");
    res.json({ quote: response.data[0].q });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
});

export default router;

