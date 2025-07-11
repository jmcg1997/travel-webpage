import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDestinations } from "../services/destinationService";
import DestinationCard from "../components/DestinationCard";
import Loader from "../components/Loader";

export default function Destinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]); // Destination list
  const [loading, setLoading] = useState(true);         // Loading indicator
  const [error, setError] = useState("");                // Error message

  // Fetch all destinations from backend
  const loadDestinations = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await fetchDestinations();
      setDestinations(data);
    } catch (err) {
      setError("Error loading destinations.");
    } finally {
      setLoading(false);
    }
  };

  // Load destinations on first render
  useEffect(() => {
    loadDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header with title and button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Your Destinations
          </h2>
          <button
            onClick={() => navigate("/destinations/new")}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            + Add Destination
          </button>
        </div>

        {/* Show loader */}
        {loading && <Loader />}

        {/* Show error if any */}
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
        )}

        {/* If no destinations */}
        {destinations.length === 0 && !loading && (
          <p className="text-gray-600 text-center">
            You have no destinations yet.
          </p>
        )}

        {/* Destination grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((d) => (
            <DestinationCard
              key={d._id}
              destination={d}
              onUpdated={loadDestinations} // Refresh after update/delete
            />
          ))}
        </div>
      </div>
    </div>
  );
}
