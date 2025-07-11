import express from 'express';
import Destination from '../models/Destination.js';
import {
  getUserDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination
} from '../controllers/destinationController.js';

import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all destination routes
router.use(authMiddleware);

/* ------------------------------
   📍 DESTINATION ROUTES (USER)
-------------------------------*/

// Get all destinations for the authenticated user
router.get('/', getUserDestinations);

// Get all favorite destinations
router.get('/favorites', async (req, res) => {
  try {
    const favorites = await Destination.find({
      user: req.user._id,
      isFavorite: true
    }).sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites.' });
  }
});

// Create a new destination
router.post('/', createDestination);

// Fully update or replace a destination
router.put('/:id', updateDestination);

// Toggle favorite status of a destination
router.patch('/:id/favorite', async (req, res) => {
  try {
    const destination = await Destination.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found.' });
    }

    destination.isFavorite = !destination.isFavorite;
    await destination.save();

    res.status(200).json({
      message: `Destination ${destination.isFavorite ? 'marked as' : 'removed from'} favorites.`,
      isFavorite: destination.isFavorite
    });
  } catch (error) {
    console.error('Error updating favorite:', error);
    res.status(500).json({ message: 'Error updating favorite status.' });
  }
});

// Get destinations near a specific location using geospatial query
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({ message: 'lat, lng, and radius are required query parameters.' });
    }

    const destinations = await Destination.find({
      user: req.user._id,
      coordinates: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1 // Convert radius to radians (Earth's radius ~6378.1 km)
          ]
        }
      }
    });

    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching nearby destinations:', error);
    res.status(500).json({ message: 'Error fetching nearby destinations.' });
  }
});

// Get a single destination by ID
router.get('/:id', getDestinationById);

// Update a destination (partial update)
router.patch('/:id', updateDestination);

// Delete a destination by ID
router.delete('/:id', deleteDestination);

export default router;
