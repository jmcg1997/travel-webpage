import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { KeyIcon } from "@heroicons/react/24/solid";

export default function ForgotPassword() {
  // State to hold the email input
  const [email, setEmail] = useState("");

  // State to manage the loading status
  const [loading, setLoading] = useState(false);

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prevent reset for protected accounts
    if (email === import.meta.env.VITE_PROTECTED_EMAIL) {
      toast.error("Password reset is disabled for this account.");
      setLoading(false);
      return;
    }

    try {
      // Call backend endpoint to generate reset token
      const res = await api.post("/auth/forgot-password", { email });

      // Simulate email by showing the reset link in console (for development)
      if (res.data.resetLink) {
        console.log("🔗 Password Reset Link:", res.data.resetLink);
      }

      // Store email locally for use in reset form
      localStorage.setItem("resetEmail", email);

      toast.success(
        "A reset link has been sent. Check the console (F12) for instructions!",
        { duration: 8000 }
      );

      // Clear input field after submission
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Error processing request."
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
          "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <KeyIcon className="w-12 h-12 text-indigo-400" />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-4 text-center">
          Forgot Your Password?
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login link */}
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
