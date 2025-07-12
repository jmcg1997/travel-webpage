import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error message for invalid login
  const [error, setError] = useState("");

  // Show "Go to email" button if needed
  const [showVerifyButton, setShowVerifyButton] = useState(false);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Send login request to backend
      const res = await api.post("/auth/login", { email, password });

      // Call login function from context with returned user and token
      login(res.data.user, res.data.token);

      // Show success toast and redirect
      toast.success(`Welcome back, ${res.data.user.username}!`);
      navigate("/home");

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please try again.";
      setError(msg);
      console.error(err);
      toast.error(msg);

      // If email verification is required, show "Go to email" button
      if (msg === "Please verify your email before logging in.") {
        setShowVerifyButton(true);
      }
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
      {/* Login Card */}
      <div className="bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <LockClosedIcon className="w-12 h-12 text-indigo-400" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-center">Login to Your Account</h2>

        {/* Error message if login fails */}
        {error && (
          <p className="bg-red-500 bg-opacity-20 text-red-300 px-4 py-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-600 bg-black bg-opacity-40 text-white placeholder-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>

        {/* Links to Forgot Password / Register */}
        <div className="mt-4 text-center space-y-2">
          <p>
            <Link to="/forgot-password" className="text-indigo-400 hover:underline">
              Forgot your password?
            </Link>
          </p>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Register
            </Link>
          </p>
        </div>

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
      </div>
    </div>
  );
}
