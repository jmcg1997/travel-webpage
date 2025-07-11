import Destination from "../models/Destination.js";
import validateDestinationInput from "../utils/validateDestination.js";
import { geocodeCity } from "../utils/geocode.js";

// Get all destinations for the authenticated user
export const getUserDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ message: "Error fetching user destinations." });
  }
};

// Get a single destination by its ID
export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findOne({ _id: req.params.id, user: req.user._id });
    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }
    res.status(200).json(destination);
  } catch (error) {
    console.error("Error fetching destination:", error);
    res.status(500).json({ message: "Error fetching the destination." });
  }
};

// Create a new destination entry
export const createDestination = async (req, res) => {
  try {
    // Validate input fields
    const validationErrors = validateDestinationInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    let coordinates = req.body.coordinates;

    // Attempt to auto-fill missing coordinates using geocoding
    if (
      !coordinates ||
      typeof coordinates.lat !== "number" ||
      typeof coordinates.lng !== "number"
    ) {
      const locationQuery = req.body.city || req.body.country;
      if (locationQuery) {
        try {
          coordinates = await geocodeCity(locationQuery);
        } catch (geocodeErr) {
          console.warn("Geocoding failed, proceeding without coordinates");
          coordinates = undefined;
        }
      }
    }

    // Build the destination object
    const newDestinationData = {
      ...req.body,
      user: req.user._id,
    };

    // Assign coordinates if they were retrieved
    if (
      coordinates &&
      typeof coordinates.lat === "number" &&
      typeof coordinates.lng === "number"
    ) {
      newDestinationData.coordinates = coordinates;
    }

    // Save destination to database
    const newDestination = new Destination(newDestinationData);
    const saved = await newDestination.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating destination:", error);
    res.status(500).json({ message: "Error creating destination." });
  }
};

// Update an existing destination
export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found or unauthorized." });
    }

    Object.assign(destination, req.body); // Merge updated fields
    await destination.validate();         // Validate before saving
    const updated = await destination.save();

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating destination:", error);
    res.status(500).json({ message: "Error updating destination." });
  }
};

// Delete a destination by ID
export const deleteDestination = async (req, res) => {
  try {
    const deleted = await Destination.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Destination not found or unauthorized." });
    }

    res.status(200).json({ message: "Destination deleted successfully." });
  } catch (error) {
    console.error("Error deleting destination:", error);
    res.status(500).json({ message: "Error deleting destination." });
  }
};

// Toggle the favorite status of a destination
export const toggleFavorite = async (req, res) => {
  try {
    const destination = await Destination.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!destination) {
      return res.status(404).json({ message: "Destination not found." });
    }

    // Flip the isFavorite boolean
    destination.isFavorite = !destination.isFavorite;
    await destination.save();

    res.status(200).json({
      message: `Destination ${destination.isFavorite ? "marked as" : "removed from"} favorites.`,
      isFavorite: destination.isFavorite,
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    res.status(500).json({ message: "Error updating favorite status." });
  }
};

// Get all destinations marked as favorite
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Destination.find({
      user: req.user._id,
      isFavorite: true,
    }).sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: "Error fetching favorites." });
  }
};

// Get destinations near a specific location
export const getNearbyDestinations = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng || !radius) {
      return res.status(400).json({ message: "lat, lng, and radius are required query parameters." });
    }

    // Find all destinations within a spherical radius from the given coordinates
    const destinations = await Destination.find({
      user: req.user._id,
      coordinates: {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            parseFloat(radius) / 6378.1, // Earth's radius in km
          ],
        },
      },
    });

    res.status(200).json(destinations);
  } catch (error) {
    console.error("Error fetching nearby destinations:", error);
    res.status(500).json({ message: "Error fetching nearby destinations." });
  }
};
