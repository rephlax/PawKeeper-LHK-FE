import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const webToken = localStorage.getItem("authToken");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";

const UserPage = () => {
  const [userInfo, setUserInfo] = useState({});
  const [pets, setPets] = useState([])
  const { user, handleLogout, handleDeleteUser } = useContext(AuthContext);
  const { userId } = useParams();


  useEffect(() => {
    async function getOneUser() {
      try {
        const userData = await axios.get(
          `${BACKEND_URL}/users/user/${userId}`,
          { headers: { authorization: `Bearer ${webToken}` } }
        );
        setUserInfo(userData.data);
        
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllPets() {
      try {
        const userPets = await axios.get(`${BACKEND_URL}/pets/${userId}`, { headers: { authorization: `Bearer ${webToken}` } });
        setPets(userPets.data)

      } catch (error) {
        console.log(error);
      }
    }

    if (userId) {
      getOneUser();
      getAllPets();
    }
  }, [userId]);


 
//TODO: backed to create get all pets by user ID then axios call to get them here
 
  return (
    <div>
      <h1>User Page</h1>
      {userInfo && userInfo ? (
        <div>
          {userInfo.profilePicture ? (
            <img src={userInfo.profilePicture} className="profilePic" />
          ) : (
            <img src={defaultUser} className="profilePic" />
          )}
          <h2>Welcome, {userInfo.username}!</h2>
          <p>Email: {userInfo.email}</p>
          <p>Rating: {userInfo.rating}</p>
          <p>
            <strong>Location:</strong>
          </p>
          <p>
            Latitude:{" "}
            {userInfo.location?.coordinates?.latitude || "Not available"}
          </p>
          <p>
            Longitude:{" "}
            {userInfo.location?.coordinates?.longitude || "Not available"}
          </p>

          <div className="pets">
            <p>Owned Pets</p>
            {pets.length > 0 ? (
              pets.map((pet, index) => (
                <div key={pet._id || index}>
                  <p>
                    <strong>Name:</strong> {pet.petName}
                  </p>
                  <p>
                    <strong>Age:</strong> {pet.petAge}
                  </p>
                  <p>
                    <strong>Species:</strong> {pet.petSpecies}
                  </p>
                  <button>Delete Pet</button>
                  <hr />
                </div>
              ))
            ) : (
              <p>No pets owned.</p>
            )}
            <Link to={`/pets/add-pet/${userId}`}>Add Pet</Link>
          </div>

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
