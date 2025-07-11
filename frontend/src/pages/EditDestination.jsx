import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchDestinationById,
  updateDestination
} from "../services/destinationService";
import DestinationForm from "../components/DestinationForm";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

export default function EditDestination() {
  const { id } = useParams();           // Destination ID from URL
  const navigate = useNavigate();

  const [form, setForm] = useState(null);     // Holds form data
  const [loading, setLoading] = useState(true); // Whether the destination is loading
  const [saving, setSaving] = useState(false); // Whether we are currently saving
  const [error, setError] = useState("");      // Error message

  // Load destination data when component mounts
  useEffect(() => {
    const loadDestination = async () => {
      try {
        const data = await fetchDestinationById(id);

        // Initialize form values, handling optional fields
        setForm({
          ...data,
          coordinates: {
            lat: data.coordinates?.lat ?? "",
            lng: data.coordinates?.lng ?? ""
          },
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : ""
        });
      } catch (err) {
        console.error(err);
        setError("Error loading destination.");
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle coordinate fields separately
    if (name === "lat" || name === "lng") {
      setForm((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        coordinates: {
          lat: parseFloat(form.coordinates.lat),
          lng: parseFloat(form.coordinates.lng)
        },
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      };

      await updateDestination(id, payload);
      toast.success("Destination updated!");
      navigate("/destinations");
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Something went wrong.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Show loader while loading destination
  if (loading) return <Loader />;

  // Show error if destination was not found
  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Destination not found."}</p>
      </div>
    );
  }

  // Render form with existing destination data
  return (
    <DestinationForm
      title="Edit Destination"
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
      loading={saving}
      error={error}
      submitLabel="Save Changes"
    />
  );
}
