import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

const UpdateUserForm = () => {
  const { user, userId} = useContext(AuthContext);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [rate, setRate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sitter, setSitter] = useState(false);
  
  const webToken = localStorage.getItem("authToken")

  useEffect(() => {
    async function getOneUser() {
        
     if(webToken) {
      try {
        const userToUpdate = await axios.get(`${BACKEND_URL}/users/user/${userId}`, {headers: {
            authorization: `Bearer ${webToken}`
        }});
        const user = userToUpdate.data
        setUsername(user.username);
        setEmail(user.email);
        setProfilePicture(user.profilePicture);
        setRate(user.rate);
        setLatitude(user.location?.coordinates.latitude || 0);
        setLongitude(user.location?.coordinates.longitude || 0);
        setSitter(user.sitter)
       
      } catch (error) {
        console.log("Here is the error", error);
      }
     }
    }
    getOneUser();
  }, [userId]);

  async function handleUpdateUser() {
   

    if(webToken) {
      try {
        const updatedUser = {
          username,
          email,
          password,
          profilePicture,
          rate,
          latitude,
          longitude,
          sitter      
        }

        await axios.patch(`${BACKEND_URL}/users/user/${userId}`, updatedUser)
        
      } catch (error) {
        console.log("Here is the Error", error)
      }
    }

  }




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
          Change Password
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
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
          Profile Picture (URL)
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => {
              setProfilePicture(e.target.value);
            }}
          />
        </label>

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
      </form>
    </>
  );
};

export default UpdateUserForm;
