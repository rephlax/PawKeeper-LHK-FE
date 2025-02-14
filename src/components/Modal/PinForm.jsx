import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const PinForm = ({ onClose }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    services: ["Dog Walking", "Cat Sitting"],
    availability: "Part Time",
    hourlyRate: 0,
  });

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is required to create a pin");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log("Got position:", position);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          try {
            const pinData = {
              latitude: location.lat,
              longitude: location.lng,
              title:
                formData.title || `${user.username}'s Pet Sitting Location`,
              description:
                formData.description || "Available for pet sitting services",
              services: formData.services,
              availability: formData.availability,
              hourlyRate: formData.hourlyRate,
            };

            const response = await axios.post(
              `${BACKEND_URL}/api/location-pins/create`,
              pinData,
              getAuthConfig(),
            );

            if (socket) {
              socket.emit("pin_created", response.data);
              socket.emit("share_location", location);
            }

            onClose();
          } catch (error) {
            console.error("Error creating pin:", error);
            alert("Failed to create pin. Please try again.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Unable to get your location. Please check your browser settings.",
          );
        },
      );
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create Sitter Pin</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
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
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Pin
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinForm;
