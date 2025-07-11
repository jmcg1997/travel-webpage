import express from 'express';
import axios from 'axios';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes with JWT authentication
router.use(authMiddleware);

/* -----------------------------------------
   🌦️ WEATHER API 
   GET /api/external/weather?lat=...&lng=...
------------------------------------------ */
router.get('/weather', async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'lat and lng are required query parameters.' });
  }

  try {
    const response = await axios.get(process.env.WEATHER_API_URL, {
      params: {
        latitude: lat,
        longitude: lng,
        current_weather: true
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather:', error);
    res.status(500).json({ message: 'Error fetching weather data.' });
  }
});

/* -----------------------------------------
   💬 RANDOM QUOTE API
   GET /api/external/quote
------------------------------------------ */
router.get('/quote', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.QUOTES_API_URL}/random`);
    const quote = response.data[0];

    res.status(200).json({
      content: quote.q,
      author: quote.a
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ message: 'Error fetching quote.' });
  }
});

/* -----------------------------------------
   🌍 COUNTRY INFO API
   GET /api/external/country/:name
------------------------------------------ */
router.get('/country/:name', async (req, res) => {
  try {
    const response = await axios.get(`${process.env.COUNTRIES_API_URL}/name/${encodeURIComponent(req.params.name)}`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching country info:', error);
    res.status(500).json({ message: 'Error fetching country information.' });
  }
});

export default router;
