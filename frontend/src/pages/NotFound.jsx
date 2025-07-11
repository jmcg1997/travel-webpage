import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate(); // Hook to navigate to another route

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 text-center">
      {/* 404 Title */}
      <h1 className="text-6xl font-bold text-indigo-500 mb-4">404</h1>

      {/* Error Message */}
      <h2 className="text-2xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-300 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Navigation Button */}
      <button
        onClick={() => navigate("/home")}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
      >
        ← Back to Home
      </button>
    </div>
  );
}
