import React from "react";

export default function PhotoModal({ image, onClose }) {
  // If no image is passed, don't render anything
  if (!image) return null;

  return (
    // Fullscreen overlay with semi-transparent background
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden max-w-md w-full shadow-lg relative">
        {/* Close button in the top-right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
        >
          ✕
        </button>

        {/* Display image from API URL */}
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${image.url}`}
          alt={image.caption || "Photo"}
          className="w-full object-cover"
        />

        {/* Optional caption if available */}
        {image.caption && (
          <div className="p-3 text-gray-800 text-sm">{image.caption}</div>
        )}
      </div>
    </div>
  );
}
