import mongoose from "mongoose";

// Schema for storing user's favorite places from external sources
const favoriteSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  }, // Reference to the user who saved the favorite
  name: String,      // Name of the place
  kind: String,      // Type or category of the place
  lat: Number,       // Latitude
  lon: Number,       // Longitude
  image: String,     // Optional image URL
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

export default mongoose.model("Favorite", favoriteSchema);
