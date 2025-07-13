import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api"; // Axios instance for making API requests

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access auth context
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider component to wrap around the app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stores the current user
  const [token, setToken] = useState(localStorage.getItem("token") || null); // JWT token from localStorage
   const [isLoading, setIsLoading] = useState(true); // Loading state

  // Load user info from localStorage if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false); // ✅ Mark loading complete
  }, []);

  // Login and persist user/token in localStorage
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout and clear localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Fetch latest user data from the backend
  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Error refreshing user:", err);
    }
  };

  // Provide auth-related values to children components
  return (
    <AuthContext.Provider
      value={{ user, setUser, token, login, logout, refreshUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
