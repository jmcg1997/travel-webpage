import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getFavorites,
  createFavorite,
  deleteFavorite,
  deleteAllFavorites,
} from "../controllers/favoritesController.js";

const router = express.Router();

/* --------------------------------------------
   ⭐ FAVORITES ROUTES (Protected by JWT)
---------------------------------------------*/

// Get all favorites for the authenticated user
router.get("/", authMiddleware, getFavorites);

// Add a new favorite place
router.post("/", authMiddleware, createFavorite);

// Delete a specific favorite by ID
router.delete("/:id", authMiddleware, deleteFavorite);

// Delete all favorites for the user
router.delete("/all", authMiddleware, deleteAllFavorites);

export default router;
