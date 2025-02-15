import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import defaultPet from "../assets/defaultPet.png";
import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
import { useTranslation } from "react-i18next";

const UserPage = () => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({});
  const [pets, setPets] = useState([]);
  const { user, handleLogout, handleDeleteUser, isSitter, updateSitterStatus } =
    useAuth();
  const { userId } = useParams();
  const webToken = localStorage.getItem("authToken");

  useEffect(() => {
    async function getOneUser() {
      try {
        const userData = await axios.get(
          `${BACKEND_URL}/users/user/${userId}`,
          { headers: { authorization: `Bearer ${webToken}` } },
        );
        setUserInfo(userData.data);
      } catch (error) {
        console.log(error);
      }
    }

    async function getAllPets() {
      try {
        const userPets = await axios.get(`${BACKEND_URL}/pets/${userId}`, {
          headers: { authorization: `Bearer ${webToken}` },
        });
        setPets(userPets.data);
      } catch (error) {
        console.log(error);
      }
    }

    if (userId) {
      getOneUser();
      getAllPets();
    }
  }, [userId]);

  const handleSitterToggle = async () => {
    const success = await updateSitterStatus(!isSitter());
    if (success) {
      setUserInfo((prev) => ({
        ...prev,
        sitter: !prev.sitter,
      }));
    }
  };

  async function handleDeletePet(id) {
    const deletedPet = await axios.delete(`${BACKEND_URL}/pets/${id}`, {
      headers: { authorization: `Bearer ${webToken}` },
    });
    const filteredPets = pets.filter((pet) => pet._id !== id);
    setPets(filteredPets);
  }

  return (
    <div>
      <h1>{t('userpage.title')}</h1>
      {userInfo && userInfo ? (
        <div>
          {userInfo.profilePicture ? (
            <img
              src={userInfo.profilePicture}
              className="profilePic"
              alt="Profile"
            />
          ) : (
            <img
              src={defaultUser}
              className="profilePic"
              alt="Default profile"
            />
          )}
          <h2>{t('userpage.welcome')}, {userInfo.username}!</h2>
          <p>{t('forms.emailLabel')}: {userInfo.email}</p>
          <p>{t('userpage.rating')}: {userInfo.rating}</p>

          {/* Sitter Status Toggle */}
          {user && user._id === userId && (
            <div className="sitter-status my-4">
              <p>Sitter Status: {userInfo.sitter ? "Active" : "Inactive"}</p>
              <button
                onClick={handleSitterToggle}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                {userInfo.sitter
                  ? "Deactivate Sitter Status"
                  : "Become a Sitter"}
              </button>
            </div>
          )}

          <p>
            <strong>{t('signuppage.locationLabel')}:</strong>
          </p>
          <p>
          {t('signuppage.latitudePlaceholder')}:{" "}
            {userInfo.location?.coordinates?.latitude || "Not available"}
          </p>
          <p>
          {t('signuppage.longitudePlaceholder')}:{" "}
            {userInfo.location?.coordinates?.longitude || "Not available"}
          </p>

          <div className="pets">
            <p>{t('userpage.pets.allpets')}</p>
            {pets.length > 0 ? (
              pets.map((pet, index) => (
                <div key={pet._id || index}>
                  <p>
                    <strong>{t('userpage.pets.name')}:</strong> {pet.petName}
                  </p>
                  <p>
                    <strong>{t('userpage.pets.age')}:</strong> {pet.petAge}
                  </p>
                  <p>
                    <strong>{t('userpage.pets.species')}:</strong> {pet.petSpecies}
                  </p>
                  {/* {pet.petPicture ? <img src={pet.petPicture} alt=""/>: <img src={defaultUser} alt=""/>} */}
                  <button onClick={() => handleDeletePet(pet._id)}>
                  {t('userpage.pets.deletepet')}
                  </button>
                  <Link to={`/pets/update-pet/${userId}/${pet._id}`}>
                    <button>Update Pet Info</button>
                  </Link>
                  <hr className="my-2" />
                </div>
              ))
            ) : (
              <p>{t('userpage.pets.nopets')}.</p>
            )}
            <Link
              to={`/pets/add-pet/${userId}`}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
            >
              {t('userpage.pets.addpet')}
            </Link>
          </div>

          <div className="action-buttons mt-6 space-y-2">
            <Link to={`/users/update-user/${userId}`}>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {t('userpage.update')}
              </button>
            </Link>
            <button
              onClick={handleDeleteUser}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {t('userpage.deleteuser')}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              {t('userpage.logout')}
            </button>
            <Link to={`/users/update-user/${userId}/password-change`}>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              {t('userpage.newpass')}
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <p>{t('userpage.loading')}...</p>
      )}
    </div>
  );
};

export default UserPage;
