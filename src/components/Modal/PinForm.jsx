import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PinForm = ({
  onClose,
  isEditing = false,
  initialData = null,
  onSubmit = null,
}) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    services: initialData?.services || ["Dog Walking", "Cat Sitting"],
    availability: initialData?.availability || "Part Time",
    hourlyRate: initialData?.hourlyRate || 0,
  });

  useEffect(() => {
    console.log("PinForm mounted with:", {
      user: !!user,
      socket: !!socket,
      isEditing,
      hasInitialData: !!initialData,
    });
  }, []);

  const getAuthConfig = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    };
    console.log("Auth config generated:", config);
    return config;
  };

  const validateForm = () => {
    console.log("Validating form data:", formData);

    if (!formData.title.trim()) {
      console.log("Validation failed: Title is required");
      alert("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      console.log("Validation failed: Description is required");
      alert("Description is required");
      return false;
    }
    if (formData.hourlyRate <= 0) {
      console.log("Validation failed: Invalid hourly rate");
      alert("Please enter a valid hourly rate");
      return false;
    }
    console.log("Form validation passed");
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", { name, value });
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hourlyRate" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    console.log("Submit button clicked");
    try {
      if (!validateForm()) {
        console.log("Form validation failed");
        return;
      }

      if (!navigator.geolocation) {
        console.log("Geolocation not available");
        alert("Geolocation is required to create a pin");
        return;
      }

      setIsLoading(true);
      console.log("Getting current position...");

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Position received:", position);
          try {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            console.log("Formatted location:", location);

            const pinData = {
              latitude: location.lat,
              longitude: location.lng,
              title: formData.title,
              description: formData.description,
              services: formData.services,
              availability: formData.availability,
              hourlyRate: parseFloat(formData.hourlyRate),
            };

            console.log("Submitting pin data:", pinData);
            console.log("API URL:", `${BACKEND_URL}/api/location-pins/create`);

            let response;
            if (isEditing && onSubmit) {
              console.log("Updating existing pin");
              response = await onSubmit({
                ...pinData,
                id: initialData._id,
              });
            } else {
              console.log("Creating new pin");
              response = await axios.post(
                `${BACKEND_URL}/api/location-pins/create`,
                pinData,
                getAuthConfig(),
              );
            }

            console.log("Pin operation successful:", response.data);

            if (socket) {
              console.log("Emitting socket events");
              socket.emit(
                isEditing ? "pin_updated" : "pin_created",
                response.data,
              );
              socket.emit("share_location", location);
            } else {
              console.warn("Socket not available for events");
            }

            onClose();
          } catch (error) {
            console.error("Error with pin operation:", error);
            console.error("Error details:", {
              message: error.message,
              response: error.response,
            });
            alert(
              error.response?.data?.message ||
                `Failed to ${isEditing ? "update" : "create"} pin. Please try again.`,
            );
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setIsLoading(false);
          alert(
            `Unable to get your location. Error: ${error.message}. Please check your browser settings and try again.`,
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setIsLoading(false);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {isEditing ? "Edit" : "Create"} Sitter Pin
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          disabled={isLoading}
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder={`${user?.username}'s Pet Sitting Location`}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Describe your services..."
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Weekends Only">Weekends Only</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className={`flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 
              ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded ${
              isLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {isLoading
              ? "Processing..."
              : isEditing
                ? "Update Pin"
                : "Create Pin"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinForm;
