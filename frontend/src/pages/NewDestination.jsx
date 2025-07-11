import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDestination } from "../services/destinationService";
import DestinationForm from "../components/DestinationForm";
import toast from "react-hot-toast";

export default function NewDestination() {
  const navigate = useNavigate();

  // Form state to capture user input
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    category: "general",
    status: "wishlist",
    notes: "",
    tags: "" // comma-separated string input
  });

  const [loading, setLoading] = useState(false); // Button loading state
  const [error, setError] = useState("");        // Error message

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { name, country, city, category, status, notes, tags } = form;

      // Build payload with cleaned tags array
      const payload = {
        name,
        country,
        city,
        category,
        status,
        notes,
        tags: tags
          .split(",")                  // Split by comma
          .map((t) => t.trim())        // Remove whitespace
          .filter(Boolean)             // Remove empty values
      };

      console.log("Payload to send:", payload); // Debug log

      // Submit destination to backend
      await createDestination(payload);

      toast.success("Destination created!");
      navigate("/destinations");

    } catch (err) {
      console.error(err);
      setError("Error creating destination.");
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DestinationForm
      title="Add New Destination"
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
      submitLabel="Save Destination"
    />
  );
}
