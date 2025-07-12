import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { GlobeAltIcon, UserCircleIcon, SunIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State for motivational quote
  const [quote, setQuote] = useState("");

  // State for weather information
  const [weather, setWeather] = useState(null);

  // State for local time
  const [localTime, setLocalTime] = useState("");

  // Fetch a motivational quote from the API
  const fetchQuote = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/quote`);
      setQuote(response.data.quote);
    } catch (err) {
      console.error("Failed to fetch quote", err);
      toast.error("Couldn't load inspiration quote.");
    }
  };

  // Fetch weather data based on user's current geolocation
  const fetchWeather = async () => {
    try {
      const coords = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (err) => reject(err)
        );
      });

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
      );

      setWeather({
        temp: res.data.main.temp,
        desc: res.data.weather[0].description,
        icon: res.data.weather[0].icon,
        name: res.data.name,
      });
    } catch (err) {
      console.error("Failed to fetch weather", err);
      toast.error("Couldn't fetch weather data.");
    }
  };

  // useEffect to load quote, weather, and start local time interval
  useEffect(() => {
    fetchQuote();
    fetchWeather();

    const interval = setInterval(() => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Determine greeting based on time of day
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg text-center max-w-2xl w-full space-y-6">
        {/* Profile + Greeting */}
        <div className="flex flex-col items-center gap-3">
          {user?.profileImage && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${user.profileImage}`}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
            />
          )}
          <h2 className="text-4xl font-extrabold text-white text-center">
            {greeting()}, {user?.username || "Traveler"}!
          </h2>
        </div>

        {/* Inspirational Quote */}
        <div className="text-gray-400 text-lg italic">
          {quote || "Loading inspiration..."}
        </div>

        {/* Weather Info */}
        {weather && (
          <div className="flex items-center justify-center gap-4 text-white">
            <SunIcon className="w-6 h-6" />
            <div className="text-sm">
              {weather.name}: {Math.round(weather.temp)}°C – {weather.desc}
            </div>
          </div>
        )}

        {/* Local Time */}
        {localTime && (
          <div className="flex items-center justify-center gap-2 text-white text-sm">
            <ClockIcon className="w-5 h-5" />
            <span>{localTime}</span>
          </div>
        )}

        {/* Description */}
        <div className="text-gray-200 text-sm">
          Start planning your next adventure and explore destinations around the world.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center justify-center gap-2 w-full md:w-auto bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            <GlobeAltIcon className="w-5 h-5" />
            Explore
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="flex items-center justify-center gap-2 w-full md:w-auto bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition"
          >
            <UserCircleIcon className="w-5 h-5" />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
