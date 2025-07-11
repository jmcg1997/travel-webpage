import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";
import Destinations from "./pages/Destinations.jsx";
import NewDestination from "./pages/NewDestination.jsx";
import EditDestination from "./pages/EditDestination.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import NotFound from "./pages/NotFound.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Navbar from "./components/Navbar.jsx";
import UploadPhoto from "./pages/UploadPhoto.jsx";
import Explore from "./pages/Explore.jsx";
import DestinationDetail from "./pages/DestinationDetail.jsx";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const { token } = useAuth(); // Get the current user's token from context

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public Routes (only accessible when not logged in) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/home" />} />

        {/* Protected Routes (requires token) */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/explore" element={token ? <Explore /> : <Navigate to="/login" />} />
        <Route path="/destinations" element={token ? <Destinations /> : <Navigate to="/login" />} />
        <Route path="/destinations/new" element={token ? <NewDestination /> : <Navigate to="/login" />} />
        <Route path="/destinations/:id/edit" element={token ? <EditDestination /> : <Navigate to="/login" />} />
        <Route path="/destinations/:id" element={token ? <DestinationDetail /> : <Navigate to="/login" />} />

        {/* Profile Settings */}
        <Route path="/profile/edit" element={token ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="/profile/upload" element={<UploadPhoto />} />

        {/* Password Reset Routes (no token required) */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Email Verification */}
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
