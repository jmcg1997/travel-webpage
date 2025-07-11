import Favorite from "../models/Favorite.js";

// Get all favorites for the logged-in user
export const getFavorites = async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
};

// Create a new favorite (with duplicate check)
export const createFavorite = async (req, res) => {
    const { name, kind, lat, lon, image } = req.body;

    try {
        // Check if the favorite already exists for this user
        const alreadyExists = await Favorite.findOne({
            userId: req.user.id,
            name, 
        });

        if (alreadyExists) {
            return res.status(400).json({ message: "This place is already in your favorites." });
        }

        // Create and save new favorite
        const favorite = await Favorite.create({
            userId: req.user.id,
            name,
            kind,
            lat,
            lon,
            image,
        });

        res.status(201).json(favorite);
    } catch (err) {
        console.error("Error creating favorite:", err);
        res.status(500).json({ message: "Error saving favorite." });
    }
};

// Delete a specific favorite by ID
export const deleteFavorite = async (req, res) => {
    await Favorite.findByIdAndDelete(req.params.id);
    res.sendStatus(204); // No content
};

// Delete all favorites for the logged-in user
export const deleteAllFavorites = async (req, res) => {
    try {
        const result = await Favorite.deleteMany({ user: req.user.id });
        res.json({ message: `${result.deletedCount} favorites deleted.` });
    } catch (error) {
        console.error("Error deleting all favorites:", error);
        res.status(500).json({ message: "Error deleting favorites." });
    }
};
