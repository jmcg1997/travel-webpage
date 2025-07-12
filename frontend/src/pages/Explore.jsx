import { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Utensils, BedDouble, Landmark } from "lucide-react";
import toast from "react-hot-toast";

export default function Explore() {
  // State for input city
  const [city, setCity] = useState("");

  // Stores categorized results: interesting / eat / sleep
  const [places, setPlaces] = useState({ eat: [], sleep: [], interesting: [] });

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // User's saved favorite places
  const [favorites, setFavorites] = useState([]);

  // Load user's favorites on first render
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching favorites", err);
      }
    };

    fetchFavorites();
  }, []);

  // Helper to check if a place is already favorited
  const isFavorite = (place) => {
    return favorites.some(
      (fav) =>
        fav.name === place.name &&
        fav.lat === place.lat &&
        fav.lon === place.lon
    );
  };

  // Fetch nearby places using provided coordinates
  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      setLoading(true);
      setError(null);
      console.log("Calling import.meta.env.VITE_API_URL with:", lat, lon, city);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/nearby?lat=${lat}&lon=${lon}&city=${city}`
      );
      setPlaces({
        eat: res.data.eat,
        sleep: res.data.sleep,
        interesting: res.data.interesting,
      });
    } catch (err) {
      console.error(err);
      const msg = "Could not fetch nearby places.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Fetch coordinates from city name, then fetch places
  const handleCitySearch = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/geocode?city=${city}`
      );
      const { lat, lon } = res.data;
      await fetchNearbyPlaces(lat, lon);
    } catch (err) {
      console.error(err);
      const msg = "City not found.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Use browser's geolocation to fetch user's location
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      const msg = "Geolocation not supported";
      setError(msg);
      toast.error(msg);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchNearbyPlaces(latitude, longitude);
      },
      () => {
        const msg = "Unable to retrieve location";
        setError(msg);
        toast.error(msg);
      }
    );
  };

  // Save a place to favorites
  const saveFavorite = async (place) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/favorites`,
        {
          name: place.name,
          kind: place.kind,
          lat: place.lat,
          lon: place.lon,
          image: place.image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFavorites((prev) => [...prev, res.data]);
      toast.success("Place saved!");
    } catch (err) {
      console.error("Failed to save favorite", err);
      const errorMessage = err.response?.data?.message || "Could not save this place.";
      toast.error(errorMessage);
    }
  };

  // Remove a place from favorites
  const removeFavorite = async (place) => {
    try {
      const token = localStorage.getItem("token");
      const found = favorites.find(
        (fav) =>
          fav.name === place.name &&
          fav.lat === place.lat &&
          fav.lon === place.lon
      );

      if (!found) return toast.error("Favorite not found.");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/favorites/${found._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setFavorites((prev) => prev.filter((f) => f._id !== found._id));
      toast.success("Favorite removed!");
    } catch (err) {
      console.error("Failed to remove favorite", err);
      toast.error("Could not remove favorite.");
    }
  };

  // Render each category of places
  const renderCategory = (label, Icon, items) => (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
        <Icon className="w-5 h-5" /> {label}
      </h3>
      {!items || items.length === 0 ? (
        <p className="text-sm text-gray-500 mb-6">No results found.</p>
      ) : (
        <div className="grid gap-4 mb-8">
          {items.map((place, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 border border-gray-100 hover:shadow-md transition"
            >
              {place.image && (
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <div className="font-semibold text-gray-900 text-base">
                {place.name || "Unnamed Place"}
              </div>
              <div className="text-sm text-gray-500 capitalize">
                {place.kind || "Unknown type"}
              </div>
              {place.lat && place.lon && (
                <a
                  href={`https://www.google.com/maps?q=${place.lat},${place.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 text-sm underline mt-1 inline-block"
                >
                  View on Google Maps
                </a>
              )}
              <div>
                {isFavorite(place) ? (
                  <button
                    onClick={() => removeFavorite(place)}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Remove from Favorites
                  </button>
                ) : (
                  <button
                    onClick={() => saveFavorite(place)}
                    className="mt-2 text-sm text-indigo-600 underline hover:text-indigo-800"
                  >
                    Save to Favorites
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-19">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Explore Places</h2>

        {/* City search input and button */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter a city (e.g., Paris)"
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-300"
          />
          <button
            onClick={handleCitySearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {/* Use current location */}
        <div className="text-center mb-6">
          <button
            onClick={handleUseMyLocation}
            className="text-indigo-600 underline text-sm flex items-center justify-center gap-1"
          >
            <MapPin className="w-4 h-4" /> Use My Location
          </button>
        </div>

        {/* Loading / Error display */}
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* Results */}
        {renderCategory("Interesting Places", Landmark, places.interesting)}

        {/* Future feature: eat/sleep categories */}
        {/* {renderCategory("Places to Eat", Utensils, places.eat)} */}
        {/* {renderCategory("Places to Sleep", BedDouble, places.sleep)} */}
      </div>
    </div>
  );
}
