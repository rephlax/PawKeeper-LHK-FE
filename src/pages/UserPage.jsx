import axios from "axios";
import { useNavigate, useParams, Link} from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
// import axios from "axios";

const UserPage = () => {
  const { user, userId, handleLogout, handleDeleteUser } = useContext(AuthContext);
  const nav = useNavigate();
  const { id } = useParams(); // Assuming the user ID is passed as a URL parameter

  console.log(user, userId);

  return (
    <div>
      <h1>User Page</h1>
      {userData ? (
        <div>
          {user.profilePicture ? (
            <img src={user.profilePicture} />
          ) : (
            <img src={defaultUser} />
          )}
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          <p>Rating: {user.rating}</p>
          <p>Location: {user.location}</p>
          <div className="action-buttons">
            <Link to={`/users/update-user/${userId}`}><button>Update User Information</button></Link>
            <button onClick={handleDeleteUser}>Delete User</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;