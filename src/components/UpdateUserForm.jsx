import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

const UpdateUserForm = () => {
  const { user, userId } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [rate, setRate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sitter, setSitter] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false)

  const nav = useNavigate()
  const webToken = localStorage.getItem("authToken");

  useEffect(() => {
    async function getOneUser() {
      if (webToken) {
        try {
          const userToUpdate = await axios.get(
            `${BACKEND_URL}/users/user/${userId}`,
            {
              headers: {
                authorization: `Bearer ${webToken}`,
              },
            }
          );
          const user = userToUpdate.data;
          setUsername(user.username);
          setEmail(user.email);
          setProfilePicture(user.profilePicture);
          setRate(user.rate);
          setLatitude(user.location?.coordinates.latitude || 0);
          setLongitude(user.location?.coordinates.longitude || 0);
          setSitter(user.sitter);
        } catch (error) {
          console.log("Here is the error", error);
        }
      }
    }
    getOneUser();
  }, [userId]);

  async function handleUpdateUser(e) {
    e.preventDefault();

    const updatedUser = {
      username,
      email,
      profilePicture,
      rate,
      location: {
        coordinates: {
          latitude,
          longitude,
        },
      },
      sitter,
    };

    console.log(updatedUser);

    if (webToken) {
      try {
        await axios.patch(
          `${BACKEND_URL}/users/update-user/${userId}`,
          updatedUser,
          { headers: { authorization: `Bearer ${webToken}` } }
        );

        alert("User Updated!")
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.log("Here is the Error", error);
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
        formData
      );

      console.log(response);
      setProfilePicture(response.data.secure_url);
      console.log(profilePicture); // Save Cloudinary image URL in state
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleUpdateUser} className="form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </label>

        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </label>

        <label>
          Profile Picture 
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button> 

        <label>
          Rate
          <input
            type="number"
            value={rate}
            onChange={(e) => {
              setRate(e.target.value);
            }}
          />
        </label>

        <label>
          Location
          <input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => {
              setLatitude(e.target.value);
            }}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => {
              setLongitude(e.target.value);
            }}
          />
        </label>

        <label>
          Are you a pet sitter?
          <input
            type="checkbox"
            checked={sitter}
            onChange={(e) => {
              setSitter(e.target.checked);
            }}
          />
        </label>

        <button type="submit">Submit</button>
        <Link to={`/users/user/${userId}`}>

        <button>Back to Profile</button>
        </Link>
      </form>
    </>
  );
};

export default UpdateUserForm;
