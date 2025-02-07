import { useParams } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/users/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return (
    <div>
      <h1>User Page</h1>
      {userData ? (
        <div>
          {userData.profilePicture ? 
            <img src={userData.profilePicture} alt="Profile" /> : 
            <img src={defaultUser} alt="Default profile" />
          }
          <h2>Welcome, {userData.username}!</h2>
          <p>Email: {userData.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;