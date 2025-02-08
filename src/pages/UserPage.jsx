import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const webToken = localStorage.getItem("authToken");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

const UserPage = () => {
  const [userData, setUserData] = useState({});
  const { user, handleLogout, handleDeleteUser } = useContext(AuthContext);
  const { userId } = useParams();
  useEffect(() => {
    async function getOneUser() {
      try {
        const userData = await axios.get(
          `${BACKEND_URL}/users/user/${userId}`,
          { headers: { authorization: `Bearer ${webToken}` } }
        );
        setUserData(userData);
      } catch (error) {
        console.log(error);
      }
    }

    if (userId) {
      getOneUser();
    }
  }, [userId]);

  return (
    <div>
      <h1>User Page</h1>
      {userData.data ? (
        <div>
          {userData.data.profilePicture ? (
            <img src={userData.data.profilePicture} className="profilePic" />
          ) : (
            <img src={defaultUser} className="profilePic" />
          )}
          <h2>Welcome, {userData.data.username}!</h2>
          <p>Email: {userData.data.email}</p>
          <p>Rating: {userData.data.rating}</p>
          <p>Location:</p>
          <ul>
            <li>Latitude: {userData.data.location.coordinates.latitude}</li>
            <li>Longitude: {userData.data.location.coordinates.longitude}</li>
          </ul>
          <div className="action-buttons">
            <Link to={`/users/update-user/${userId}`}>
              <button>Update User Information</button>
            </Link>
            <button onClick={handleDeleteUser}>Delete User</button>
            <button onClick={handleLogout}>Logout</button>
            <Link to={`/users/update-user/${userId}/password-change`}>
              <button>Change Password</button>
            </Link>
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;
