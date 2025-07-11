import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useState("");

  // On mount, retrieve the pending email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingVerificationEmail");
    if (!storedEmail) {
      toast.error("No email found for verification.");
      navigate("/register");
      return;
    }

    setPendingEmail(storedEmail);
  }, [navigate]);

  // Call the API to verify the email
  const handleVerify = async () => {
    if (!pendingEmail) {
      toast.error("No email to verify.");
      return;
    }

    try {
      await api.patch("/auth/verify-email", { email: pendingEmail });
      toast.success("Email verified!");
      localStorage.removeItem("pendingVerificationEmail"); 
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">
          Verify your email
        </h2>
        <p className="text-gray-600 mb-6">
          Click the button below to verify your email address and activate your
          account.
        </p>
        <button
          onClick={handleVerify}
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Verify Email
        </button>
      </div>
    </div>
  );
}
