import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  toggleFavorite,
  deleteDestination,
} from "../services/destinationService";

import {
  StarIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

// Card component that displays a travel destination
export default function DestinationCard({ destination, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Toggle favorite status of the destination
  const handleToggleFavorite = async () => {
    setError("");
    setLoading(true);
    try {
      await toggleFavorite(destination._id);
      if (onUpdated) onUpdated(); // Notify parent to refresh the list
    } catch (err) {
      setError("Error updating favorite.");
    } finally {
      setLoading(false);
    }
  };

  // Delete the destination after confirmation
  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${destination.name}"?`)) return;
    setError("");
    setLoading(true);
    try {
      await deleteDestination(destination._id);
      if (onUpdated) onUpdated();
    } catch (err) {
      setError("Error deleting destination.");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to the edit page
  const handleEdit = () => {
    navigate(`/destinations/${destination._id}/edit`);
  };

  // Navigate to the detail view
  const handleView = () => {
    navigate(`/destinations/${destination._id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-xl transition">
      {/* Image Section */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={
            destination.imageUrl
              ? destination.imageUrl
              : "https://placehold.co/600x400?text=No+Image"
          }
          alt={destination.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text and Actions */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate">
            {destination.name}
          </h3>
          <p className="text-sm text-gray-600">
            {destination.country} {destination.city ? `• ${destination.city}` : ""}
          </p>
          {destination.notes && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {destination.notes}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* View button */}
          <button
            onClick={handleView}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-indigo-600 hover:text-white transition"
          >
            View
          </button>

          {/* Favorite button */}
          <button
            onClick={handleToggleFavorite}
            disabled={loading}
            className={`flex items-center gap-1 text-xs px-3 py-1 rounded transition ${
              destination.isFavorite
                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                : "bg-gray-200 text-gray-800 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            <StarIcon className="h-4 w-4" />
          </button>

          {/* Edit button */}
          <button
            onClick={handleEdit}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-blue-600 hover:text-white transition "
          >
            <PencilSquareIcon className="h-4 w-4" />
          </button>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-red-600 hover:text-white transition"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 mt-2 text-xs">{error}</p>}
      </div>
    </div>
  );
}
