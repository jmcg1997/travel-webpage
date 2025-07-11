import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

// Modal component to handle password change
export default function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change for form fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new passwords match
    if (form.newPassword !== form.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    // Confirm user action
    const confirmed = confirm("Are you sure you want to change your password?");
    if (!confirmed) return;

    setLoading(true);
    try {
      // Make API request to update password
      await api.patch("/auth/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      toast.success("Password changed successfully.");

      // Reset form after successful update
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error changing password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fullscreen modal backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
        <h3 className="text-xl font-bold mb-4">Change Password</h3>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="confirmNewPassword"
            value={form.confirmNewPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="border p-2 rounded"
            required
          />

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              {loading ? "Saving..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
