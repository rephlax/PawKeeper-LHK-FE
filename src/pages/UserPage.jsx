
import { useNavigate, useParams, Link} from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

const UserPage = () => {
  const { user, handleLogout, handleDeleteUser } = useContext(AuthContext);
  
  const {userId} = useParams()

  console.log(user, userId);

  return (
    <div>
      <h1>User Page</h1>
      {user ? (
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