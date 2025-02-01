import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png"
import { useContext, useEffect } from "react";

const UserPage = () => {
  // const {userId} = 
  const {user, userId} = useContext(AuthContext);
  
  // console.log(userId)
  
    
   //TODO: finish implementing the displayed details
  
  return (
    <div>
      <h1>User Page</h1>
      {user ? (
        <div>
          {user.profilePicture? <img src={user.profilePicture}/>: <img src={defaultUser}/>}
          <h2>Welcome, {user.username}!</h2>
          <p>Email: {user.email}</p>
          
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
};

export default UserPage;
