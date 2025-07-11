import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import toast from "react-hot-toast";

export default function EditProfile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // Form state for username, description, birthdate
  const [form, setForm] = useState({
    username: "",
    description: "",
    birthDate: "",
  });

  // File/image preview state
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // UI states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Pre-fill form with current user data when available
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        description: user.description || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
      });
    }
  }, [user]);

  // Handle input field changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle profile image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Update text-based profile info
      await api.patch("/auth/me", {
        username: form.username,
        description: form.description,
        birthDate: form.birthDate,
      });

      // If an image is selected, upload it separately
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        await api.patch("/auth/profile-image", formData);
      }

      // Refresh global user state
      await refreshUser();
      toast.success("Profile updated!");
      navigate("/profile");

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Error updating profile.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Optional fallback UI while user is still loading
  if (!user) {
    return <div className="text-white text-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-12">
      <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-center">Edit Your Profile</h2>

        {/* Show error if any */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</p>
        )}

        {/* Profile edit form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Your username"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Description field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Birthdate field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Birthdate</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          {/* Profile image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 px-8">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full mt-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
            />
            {/* Image preview */}
            {preview && (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover mt-2 rounded-md" />
            )}
          </div>

          {/* Save and remove buttons */}
          <div className="flex flex-col gap-3 mt-6">
            {/* Remove profile image */}
            <button
              type="button"
              onClick={async () => {
                if (!confirm("Are you sure you want to remove your profile image?")) return;
                setLoading(true);
                setError("");
                try {
                  await api.patch("/auth/remove-profile-image");
                  await refreshUser();
                  toast.success("Profile image removed.");
                } catch (err) {
                  console.error(err);
                  const msg = err.response?.data?.message || "Error removing image.";
                  setError(msg);
                  toast.error(msg);
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded transition"
            >
              Remove Profile Image
            </button>

            {/* Submit changes */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* Change password link and modal */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-sm text-indigo-600 underline"
          >
            Change Password
          </button>
        </div>

        {isPasswordModalOpen && (
          <ChangePasswordModal onClose={() => setIsPasswordModalOpen(false)} />
        )}

        {/* Back to profile */}
        <div className="mt-6 text-center">
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
