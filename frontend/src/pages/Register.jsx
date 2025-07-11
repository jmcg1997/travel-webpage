import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { UserPlusIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowVerifyButton(false);

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Submit registration data
      await api.post("/auth/register", { email, username, password });

      // Store email locally to simulate verification flow
      localStorage.setItem("pendingVerificationEmail", email);

      const message = "Account created successfully. Please verify your email.";
      setSuccess(message);
      toast.success(message);
      setShowVerifyButton(true);
    } catch (err) {
      // Handle error
      const errorMsg = err.response?.data?.message || "Registration failed.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* Icon and Title */}
        <div className="flex justify-center mb-4">
          <UserPlusIcon className="w-12 h-12 text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-center">Create an Account</h2>

        {/* Error Message */}
        {error && (
          <p className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {/* Success Message */}
        {success && (
          <p className="bg-green-500 bg-opacity-20 text-green-300 px-4 py-2 rounded mb-4 text-center">
            {success}
          </p>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        {/* Simulated Email Verification */}
        {showVerifyButton && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/verify-email")}
              className="bg-white text-gray-800 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 transition duration-200"
            >
              Go to your email →
            </button>
          </div>
        )}


        {/* Link to Login */}
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
