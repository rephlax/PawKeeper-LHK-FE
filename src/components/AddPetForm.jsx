import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
const webToken = localStorage.getItem("authToken");

const AddPetForm = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState(0);
  const [petSpecies, setPetSpecies] = useState("");
  const [petPicture, setPetPicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

  async function handleCreatePet(e) {
    e.preventDefault();

    if (webToken) {
      try {
        const newPet = {
          petName,
          petAge,
          petSpecies,
          petPicture,
          owner: userId,
        };
        axios.post(`${BACKEND_URL}/pets/${userId}`, newPet, {
          headers: {
            authorization: `Bearer ${webToken}`,
          },
        });

        alert("Pet Added Sucessfully!");
        nav(`/users/user/${userId}`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!imageFile) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "ml_default"); // Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dzdrwiugn/image/upload",
        formData,
      );

      console.log(response);
      setPetPicture(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form className="form" onSubmit={handleCreatePet}>
        <label>
          Pet Name:
          <input
            type="text"
            value={petName}
            onChange={(e) => {
              setPetName(e.target.value);
            }}
          />
        </label>
        <label>
          Pet Age:
          <input
            type="number"
            value={petAge}
            onChange={(e) => {
              setPetAge(e.target.value);
            }}
          />
        </label>
        <label>
          Pet Species:
          <input
            type="text"
            value={petSpecies}
            onChange={(e) => {
              setPetSpecies(e.target.value);
            }}
          />
        </label>
        <label>
          Pet Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        <button>Add Pet</button>
      </form>
    </div>
  );
};
export default AddPetForm;
