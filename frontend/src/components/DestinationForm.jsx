import { useNavigate } from "react-router-dom";
import {
  GlobeAltIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  MapIcon,
  PencilIcon,
  TagIcon
} from "@heroicons/react/24/outline";

// Form component used for creating and editing destinations
export default function DestinationForm({
  form,
  onChange,
  onSubmit,
  loading,
  error,
  title = "Add New Destination",
  submitLabel = "Save Destination",
}) {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-6 rounded shadow-md w-full max-w-lg text-white">
        {/* Form Title */}
        <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 bg-red-900 bg-opacity-20 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="grid gap-3">
          {/* Name Input */}
          <div className="relative">
            <GlobeAltIcon className="w-5 h-5 absolute left-3 top-3 text-indigo-300" />
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Name *"
              required
              className="w-full pl-10 border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Country Input */}
          <div className="relative">
            <MapPinIcon className="w-5 h-5 absolute left-3 top-3 text-indigo-300" />
            <input
              name="country"
              value={form.country}
              onChange={onChange}
              placeholder="Country *"
              required
              className="w-full pl-10 border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* City Input */}
          <div className="relative">
            <BuildingOfficeIcon className="w-5 h-5 absolute left-3 top-3 text-indigo-300" />
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="City"
              className="w-full pl-10 border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="border border-gray-600 bg-black bg-opacity-40 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="general">General</option>
            <option value="attraction">Attraction</option>
            <option value="restaurant">Restaurant</option>
            <option value="hotel">Hotel</option>
          </select>

          {/* Status Dropdown */}
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            className="border border-gray-600 bg-black bg-opacity-40 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="wishlist">Wishlist</option>
            <option value="visited">Visited</option>
          </select>

          {/* Notes Textarea */}
          <div className="relative">
            <PencilIcon className="w-5 h-5 absolute left-3 top-3 text-indigo-300" />
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              placeholder="Notes"
              className="w-full pl-10 border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
          </div>

          {/* Tags Input */}
          <div className="relative">
            <TagIcon className="w-5 h-5 absolute left-3 top-3 text-indigo-300" />
            <input
              name="tags"
              value={form.tags}
              onChange={onChange}
              placeholder="Tags (comma separated)"
              className="w-full pl-10 border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Saving..." : submitLabel}
          </button>

          {/* Back to Destinations */}
          <button
            type="button"
            onClick={() => navigate("/destinations")}
            className="mt-2 text-white-600 hover:underline text-sm"
          >
            ← Back to Destinations
          </button>
        </form>
      </div>
    </div>
  );
}
