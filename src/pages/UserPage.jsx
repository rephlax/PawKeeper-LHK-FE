import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect } from "react";

const UserPage = () => {
  const { user, userId, handleLogout } = useContext(AuthContext);
  const nav = useNavigate();
  const { id } = useParams(); // Assuming the user ID is passed as a URL parameter

 console.log(user, userId)

  return (
    <div>
      <h1>User Page</h1>
      {user ? (
        <div>
          {user.profilePicture ? <img src={user.profilePicture} /> : <img src={defaultUser} />}
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;
