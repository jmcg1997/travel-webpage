import axios from "axios";

/**
 * Fetch a random Unsplash image based on the given query.
 * Uses the Unsplash API with the "random photo" endpoint.
 * 
 * @param {string} query - The keyword to search for (e.g. city or country name)
 * @returns {string} URL of the regular-sized image or an empty string if failed
 */
export const fetchUnsplashImage = async (query) => {
  try {
    // For debugging: log the search term and access key
    console.log("🔍 Fetching Unsplash image for:", query);
    console.log("🔑 Using access key:", import.meta.env.VITE_UNSPLASH_ACCESS_KEY);

    const res = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        query,
        orientation: "landscape", // landscape images are preferred for UI
      },
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    });

    // For debugging: log the response data
    console.log("✅ Unsplash response:", res.data);

    // Return the URL of the image
    return res.data.urls.regular;
  } catch (err) {
    console.error("Error fetching Unsplash image:", err);
    return "";
  }
};
