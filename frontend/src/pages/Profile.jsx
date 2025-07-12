import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProfileGallery from "./ProfileGallery";
import { MapPin } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth(); // Authenticated user from context
  const navigate = useNavigate(); // Navigation hook
  const [profileData, setProfileData] = useState(null); // Complete user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [favorites, setFavorites] = useState([]); // User's favorite places

  // Fetch profile and favorites data from backend
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/auth/profile-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfileData(res.data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/favorites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setFavorites(res.data);
    };

    fetchFavorites();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Calculate user age from birthDate
  const calculateAge = (birthDateStr) => {
    if (!birthDateStr) return null;
    const birthDate = new Date(birthDateStr);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };

  // Destructure response data
  const { user: profileUser, stats, gallery } = profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 text-white px-4 py-17">
      <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
        {/* User Info Section */}
        <div className="flex flex-col items-center">
          <img
            src={
              profileUser?.profileImage
                ? `${import.meta.env.VITE_API_BASE_URL}${profileUser.profileImage}`
                : "https://www.gravatar.com/avatar/?d=mp&f=y"
            }
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-4 border-indigo-600 shadow mb-4"
          />
          <h2 className="text-2xl font-bold">{profileUser?.username || "Your Profile"}</h2>
          <p className="text-gray-600">{profileUser?.email}</p>
          <p className="text-gray-500 text-sm mt-1">{profileUser?.description || "No description yet."}</p>
          {profileUser.birthDate && (
            <p className="text-sm text-gray-500 mt-2">Age: {calculateAge(profileUser.birthDate)}</p>
          )}

          {/* User Stats */}
          <div className="flex gap-4 mt-4">
            <div className="text-center">
              <p className="text-lg font-semibold">{stats.totalDestinations}</p>
              <p className="text-sm text-gray-500">Destinations</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{stats.totalFavorites}</p>
              <p className="text-sm text-gray-500">Favorites</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="mt-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* User Gallery Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Gallery</h3>
          <ProfileGallery uploads={gallery} onDelete={fetchData} />
        </div>

        {/* Upload Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/profile/upload")}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Upload New Photo
          </button>
        </div>

        {/* Favorite Places Section */}
        {favorites.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-indigo-700">
              <MapPin className="w-5 h-5" />
              Saved Places
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full mt-4">
              {favorites.map((fav, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-md shadow border border-gray-200 cursor-pointer"
                >
                  {/* Image */}
                  {fav.image && (
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-full h-40 object-cover group-hover:brightness-75 transition"
                    />
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const confirm = window.confirm("Are you sure you want to remove this favorite?");
                      if (!confirm) return;

                      try {
                        const token = localStorage.getItem("token");
                        await axios.delete(
                          `${import.meta.env.VITE_API_URL}/favorites/${fav._id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          });
                        setFavorites((prev) => prev.filter((f) => f._id !== fav._id));
                      } catch (err) {
                        console.error("Failed to delete favorite", err);
                        toast.error("Could not delete favorite.");
                      }
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    title="Remove"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-2">
                    <div className="font-semibold text-gray-900 text-sm truncate">{fav.name}</div>
                    <div className="text-xs text-gray-500 capitalize truncate">{fav.kind}</div>
                    {fav.lat && fav.lon && (
                      <a
                        href={`https://www.google.com/maps?q=${fav.lat},${fav.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 text-xs underline mt-1 inline-block"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
