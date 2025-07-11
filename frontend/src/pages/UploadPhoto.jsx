import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UploadPhoto() {
  // Form state
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file input and preview generation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select an image.");
      return;
    }

    // Create form data object to send the file and caption
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Upload image via API
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/uploads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Photo uploaded successfully!");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Error uploading image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-12">
      <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Upload a New Photo</h2>

        {/* Upload form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />

          {/* Preview image */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md"
            />
          )}

          {/* Optional caption */}
          <input
            type="text"
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {/* Back to profile */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/profile")}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
