import axios from "axios";
import { useState } from "react";
import PhotoModal from "../modals/PhotoModal";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function ProfileGallery({ uploads }) {
  // Local state for uploaded images and selected image for modal
  const [items, setItems] = useState(uploads);
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem("token"); // Get auth token

  // Delete image by index
  const handleDelete = async (index) => {
    const confirm = window.confirm("Are you sure you want to delete this image?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/auth/uploads/${index}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove deleted image from local state
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    } catch (err) {
      console.error("Failed to delete image:", err);
      alert("Error deleting image");
    }
  };

  // If no uploads available
  if (!items || items.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 mt-4">
        <p>No uploads yet.</p>
        <p className="text-xs">Start adding photos to personalize your profile!</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {items.map((upload, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-md shadow border border-gray-200 cursor-pointer"
            onClick={() => setSelectedImage(upload)} // Open modal on click
          >
            {/* Image preview */}
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${upload.url}`}
              alt={upload.caption || "User upload"}
              className="w-full h-32 object-cover group-hover:brightness-75 transition"
            />

            {/* Delete button (only appears on hover) */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal from opening
                handleDelete(index);
              }}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
              title="Delete"
            >
              <TrashIcon className="w-4 h-5" />
            </button>

            {/* Optional caption below the image */}
            {upload.caption && (
              <p className="text-xs mt-1 text-center text-gray-700 px-2 truncate">
                {upload.caption}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal view for selected image */}
      <PhotoModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
}
