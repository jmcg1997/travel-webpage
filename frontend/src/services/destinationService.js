import api from "./api";
import axios from "axios";

/**
 * Fetch all destinations from the backend.
 * GET /api/destinations
 */
export const fetchDestinations = async () => {
  const res = await api.get("/destinations");
  return res.data;
};

/**
 * Create a new destination.
 * Optionally fetch an image from Unsplash based on the destination name.
 * POST /api/destinations
 */
export const createDestination = async (data) => {
  let imageUrl = "";

  try {
    // Attempt to fetch an image from Unsplash related to the destination name
    const unsplashRes = await axios.get(
      `${import.meta.env.VITE_UNSPLASH_API_URL}/search/photos`,
      {
        params: {
          query: data.name,
          per_page: 1,
        },
        headers: {
          Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    // Use the first image result, if available
    if (unsplashRes.data.results.length > 0) {
      imageUrl = unsplashRes.data.results[0].urls.regular;
    }
  } catch (err) {
    console.error("Error fetching Unsplash image:", err);
  }

  // Include the fetched image URL in the payload
  const payload = { ...data, imageUrl };

  const res = await api.post("/destinations", payload);
  return res.data;
};

/**
 * Toggle favorite status for a destination.
 * PATCH /api/destinations/:id/favorite
 */
export const toggleFavorite = async (id) => {
  const res = await api.patch(`/destinations/${id}/favorite`);
  return res.data;
};

/**
 * Delete a destination by ID.
 * DELETE /api/destinations/:id
 */
export const deleteDestination = async (id) => {
  const res = await api.delete(`/destinations/${id}`);
  return res.data;
};

/**
 * Fetch an Unsplash image related to a given query.
 * Used independently of createDestination.
 */
export const fetchUnsplashImage = async (query) => {
  const res = await fetch(
    `${import.meta.env.VITE_UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error fetching image from Unsplash.");
  }

  const data = await res.json();
  if (data.results.length > 0) {
    return data.results[0].urls.regular;
  } else {
    return null;
  }
};

/**
 * Fetch a specific destination by ID.
 * GET /api/destinations/:id
 */
export async function fetchDestinationById(id) {
  const res = await api.get(`/destinations/${id}`);
  return res.data;
}

/**
 * Update a destination by ID.
 * PUT /api/destinations/:id
 */
export async function updateDestination(id, data) {
  await api.put(`/destinations/${id}`, data);
}
