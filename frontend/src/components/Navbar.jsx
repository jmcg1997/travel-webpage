import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const { user, logout } = useAuth(); // Auth context for user info and logout
  const navigate = useNavigate(); // Used to redirect after logout
  const [menuOpen, setMenuOpen] = useState(false); // Toggle for mobile menu

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirect to landing or login page
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo - Always visible */}
        <Link
          to="/home"
          className="text-2xl font-bold tracking-wide hover:text-indigo-400 transition"
        >
          Travel Bucket
        </Link>

        {/* Desktop Menu - visible from md breakpoint and up */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/destinations" className="hover:text-indigo-400 transition">
            Destinations
          </Link>
          <Link to="/explore" className="hover:text-indigo-400 transition">
            Explore
          </Link>
          <Link to="/profile" className="hover:text-indigo-400 transition">
            Profile
          </Link>
          <button onClick={handleLogout} className="hover:text-red-400 transition">
            Logout
          </button>

          {/* User avatar and username */}
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={
                  user.profileImage
                    ? `${import.meta.env.VITE_API_BASE_URL}${user.profileImage}`
                    : "https://www.gravatar.com/avatar/?d=mp&f=y"
                }
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="text-sm">{user.username}</span>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button (hamburger / close icon) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <XMarkIcon className="w-6 h-6" />
          ) : (
            <Bars3Icon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu - visible only when menuOpen is true */}
      {menuOpen && (
        <div className="absolute top-full right-4 bg-gray-800 px-4 py-3 space-y-2 w-48 shadow-lg z-50">
          <Link to="/destinations" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>
            Destinations
          </Link>
          <Link to="/explore" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>
            Explore
          </Link>
          <Link to="/profile" className="block hover:text-indigo-400" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <button onClick={handleLogout} className="block w-full text-left hover:text-red-400">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
