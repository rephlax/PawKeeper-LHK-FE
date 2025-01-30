import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UserPage = () => {

  const {user } = useAuth();
  

  return (
    <div>
      <h1>User Page</h1>
      {user ? (
        <div>
          <img src={user.profilePicture}/>
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          {/* Add more user information as needed */}
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;
