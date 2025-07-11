import axios from "axios";
import CityPlaces from "../models/CityPlaces.js";

const BASE_URL = "https://opentripmap-places-v1.p.rapidapi.com/en/places";

// Fetch and store nearby places based on coordinates and city name
export const getNearbyPlaces = async (req, res) => {
  const { lat, lon, city } = req.query;

  if (!lat || !lon || !city) {
    return res.status(400).json({ message: "Latitude, longitude and city name are required." });
  }

  try {
    // 1. Check if the city data already exists in the database (to avoid duplicate API calls)
    const existing = await CityPlaces.findOne({ city: city.toLowerCase() });
    if (existing) {
      return res.json(existing);
    }

    // 2. Fetch raw places data from OpenTripMap API
    const radiusRes = await axios.get(`${BASE_URL}/radius`, {
      params: {
        radius: 5000, // 5km search radius
        lon,
        lat,
        format: "json",
        limit: 4,
      },
      headers: {
        "X-RapidAPI-Key": process.env.OPENTRIPMAP_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
      },
    });

    const rawPlaces = radiusRes.data;

    // 3. Categorize places into eat, sleep, and interesting
    const eat = rawPlaces.filter((p) =>
      p.kinds?.includes("foods") || p.kinds?.includes("restaurants") || p.kinds?.includes("catering")
    );

    const sleep = rawPlaces.filter((p) =>
      p.kinds?.includes("accomodations") || p.kinds?.includes("hotels") || p.kinds?.includes("hostels")
    );

    const interestingRaw = rawPlaces.filter((p) =>
      p.kinds?.includes("interesting_places") ||
      p.kinds?.includes("cultural") ||
      p.kinds?.includes("architecture") ||
      p.kinds?.includes("historic") ||
      p.kinds?.includes("monuments") ||
      p.kinds?.includes("museums")
    );

    // 4. Enrich interesting places with detailed info and preview image
    const interesting = await Promise.all(
      interestingRaw.map(async (place) => {
        try {
          const detail = await axios.get(`${BASE_URL}/xid/${place.xid}`, {
            headers: {
              "X-RapidAPI-Key": process.env.OPENTRIPMAP_RAPIDAPI_KEY,
              "X-RapidAPI-Host": "opentripmap-places-v1.p.rapidapi.com",
            },
          });

          return {
            name: detail.data.name || place.name || "Unnamed",
            kind: (place.kinds || "").split(",")[0].replace(/_/g, " "),
            lat: place.point.lat,
            lon: place.point.lon,
            image: detail.data.preview?.source || null,
          };
        } catch {
          // Fallback if detailed info request fails
          return {
            name: place.name || "Unnamed",
            kind: (place.kinds || "").split(",")[0].replace(/_/g, " "),
            lat: place.point.lat,
            lon: place.point.lon,
            image: null,
          };
        }
      })
    );

    // 5. Save the new city data to the database
    const newCityData = await CityPlaces.create({
      city: city.toLowerCase(),
      lat,
      lon,
      eat,
      sleep,
      interesting,
    });

    res.json(newCityData);
  } catch (error) {
    console.error("Error fetching or saving nearby places:", error.message);
    res.status(500).json({ message: "Failed to fetch nearby places." });
  }
};
