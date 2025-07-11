import axios from "axios";

// Geocode a city name using the OpenStreetMap Nominatim API
export async function geocodeCity(city) {
  if (!city) throw new Error("City is required");

  const response = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: city,          // Query string (city name)
      format: "json",   // Response format
      limit: 1,         // Return only the top result
    },
    headers: {
      "User-Agent": "travel-bucket-app/1.0", // Required by Nominatim usage policy
    },
  });

  const data = response.data;

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("City not found");
  }

  const { lat, lon } = data[0];
  if (!lat || !lon) {
    throw new Error("Invalid coordinates received");
  }

  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}
