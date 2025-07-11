import express from "express";
import { getNearbyPlaces } from "../controllers/nearbyController.js";
import CityPlaces from "../models/CityPlaces.js";

const router = express.Router();

/* -----------------------------------------------
   📍 NEARBY PLACES ROUTES
------------------------------------------------ */

// GET /api/nearby
// Fetch nearby places (eat, sleep, interesting) based on coordinates and cache them
router.get("/", getNearbyPlaces);

// DELETE /api/nearby/reset
// Clear all cached city place data from the database
router.delete("/reset", async (req, res) => {
  try {
    const result = await CityPlaces.deleteMany({});
    res.json({ message: "All cached cities deleted", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting cached cities:", error.message);
    res.status(500).json({ message: "Failed to delete cached cities." });
  }
});

export default router;
