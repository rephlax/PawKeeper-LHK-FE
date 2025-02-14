import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const webToken = localStorage.getItem("authToken");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

const UpdatePet = () => {
  const { userId, petId } = useParams();
  const [petName, setPetName] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petPicture, setPetPicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const nav = useNavigate();

  async function handleUpdatePet(e) {
    e.preventDefault();

    const updatedPet = {
      petName,
      petAge,
      petPicture,
    };

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/pets/${petId}`,
        updatedPet,
        { headers: { authorization: `Bearer ${webToken}` } },
      );

      if (response) {
        alert("Pet Updated");
        nav(`/users/user/${userId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function getOnePet() {
      try {
        const petToUpdate = await axios.get(
          `${BACKEND_URL}/pets/${userId}/${petId}`,
          { headers: { authorization: `Bearer ${webToken}` } },
        );

        const pet = petToUpdate.data;
        console.log(pet);
        setPetAge(pet.petAge);
        setPetName(pet.petName);
        setPetPicture(pet.petPicture);
      } catch (error) {
        console.log(error);
      }
    }

    getOnePet();
  }, [userId, petId]);

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
    <div className="form">
      <form onSubmit={handleUpdatePet}>
        <label>
          Pet Name:
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
          />
        </label>
        <label>
          Pet Age:
          <input
            type="text"
            value={petAge}
            onChange={(e) => setPetAge(e.target.value)}
          />
        </label>
        <label>
          Pet Picture:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <button type="button" onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        <button>Update Pet</button>
      </form>
    </div>
  );
};
export default UpdatePet;
