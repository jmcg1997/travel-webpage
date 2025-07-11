import mongoose from "mongoose";

// Schema for an individual place (used in grouped categories)
const placeSchema = new mongoose.Schema({
  name: String,
  kind: String,
  lat: Number,
  lon: Number,
  image: String,
});

// Schema for storing categorized places for a specific city
const cityPlacesSchema = new mongoose.Schema({
  city: { type: String, required: true, unique: true }, // City name (unique)
  lat: String,  // Latitude of the city
  lon: String,  // Longitude of the city
  eat: [placeSchema],         // Places to eat (FUTURE UPGRADE)
  sleep: [placeSchema],       // Places to sleep (FUTURE UPGRADE)
  interesting: [placeSchema], // Interesting places to visit
}, { timestamps: true }); // Automatically add createdAt and updatedAt

export default mongoose.model("CityPlaces", cityPlacesSchema);

