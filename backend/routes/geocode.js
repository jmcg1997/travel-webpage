import express from "express";
import { geocodeCity } from "../utils/geocode.js";

const router = express.Router();

/* -----------------------------------------------
   🧭 GEOCODE ROUTE
   GET /api/geocode?city=CityName
   - Returns latitude and longitude for a given city
------------------------------------------------ */
router.get("/", async (req, res) => {
  const { city } = req.query;

  try {
    const coords = await geocodeCity(city);
    res.json(coords);
  } catch (err) {
    console.error("Geocode error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
