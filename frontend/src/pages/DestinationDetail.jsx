import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDestinationById } from "../services/destinationService";
import Loader from "../components/Loader";

export default function DestinationDetail() {
  const { id } = useParams(); // Get destination ID from URL
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null); // Destination data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message

  // Fetch destination details on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDestinationById(id);
        setDestination(data);
      } catch (err) {
        console.error(err);
        setError("Error loading destination.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;

  if (error || !destination)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">{error || "Destination not found."}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-24">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow flex flex-col md:flex-row gap-6">
        {/* Left panel: Destination info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-indigo-700">
              {destination.name}
            </h2>
            <p className="text-gray-700">
              <strong>Location:</strong> {destination.city}, {destination.country}
            </p>
            <p className="text-gray-700">
              <strong>Status:</strong> {destination.status}
            </p>
            <p className="text-gray-700">
              <strong>Category:</strong> {destination.category}
            </p>
            {destination.notes && (
              <p className="text-gray-700">
                <strong>Notes:</strong> {destination.notes}
              </p>
            )}
            {/* Show tags if available */}
            {destination.tags?.length > 0 && (
              <p className="text-gray-700">
                <strong>Tags:</strong>{" "}
                {destination.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 text-xs rounded mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </div>

          {/* Back button */}
          <div className="mt-10">
            <button
              onClick={() => navigate("/destinations")}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              ← Go Back
            </button>
          </div>
        </div>

        {/* Right panel: Destination image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={
              destination.imageUrl
                ? destination.imageUrl
                : "https://placehold.co/600x400?text=No+Image"
            }
            alt={destination.name}
            className="rounded-lg shadow max-h-[400px] object-cover w-full"
          />
        </div>
      </div>
    </div>
  );
}
