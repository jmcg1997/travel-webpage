import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  // State for form fields
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Send reset request with token and new password
      await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      toast.success("Password reset successfully!");
      setToken("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error resetting password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* Icon and title */}
        <div className="flex justify-center mb-4">
          <ArrowPathIcon className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-center">
          Reset Your Password
        </h2>

        {/* Reset form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            required
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your reset token"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Info message */}
        <p className="text-center text-gray-300 mt-4 text-sm">
          Use the token you received in the console after requesting a reset.
        </p>

        {/* Navigation back to login */}
        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-indigo-400 hover:underline text-sm"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
