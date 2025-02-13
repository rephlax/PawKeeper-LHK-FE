import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext, useAuth } from "../context/AuthContext";
import defaultUser from "../assets/defaultUser.png";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
const webToken = localStorage.getItem("authToken");
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
import { useTranslation } from "react-i18next";

const UserPage = () => {
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState({});
  const [pets, setPets] = useState([]);
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
            <img src={userInfo.profilePicture} className="profilePic" />
          ) : (
            <img src={defaultUser} className="profilePic" />
          )}
          <h2>{t('userpage.welcome')}, {userInfo.username}!</h2>
          <p>{t('forms.emailLabel')}: {userInfo.email}</p>
          <p>{t('userpage.rating')}: {userInfo.rating}</p>
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
                  <button onClick={() => handleDeletePet(pet._id)}>
                  {t('userpage.pets.deletepet')}
                  </button>
                  <hr />
                </div>
              ))
            ) : (
              <p>{t('userpage.pets.nopets')}.</p>
            )}
            <Link to={`/pets/add-pet/${userId}`}>{t('userpage.pets.addpet')}</Link>
          </div>

          <div className="action-buttons">
            <Link to={`/users/update-user/${userId}`}>
              <button>{t('userpage.update')}</button>
            </Link>
            <button onClick={handleDeleteUser}>{t('userpage.deleteuser')}</button>
            <button onClick={handleLogout}>{t('userpage.logout')}</button>
            <Link to={`/users/update-user/${userId}/password-change`}>
              <button>{t('userpage.newpass')}</button>
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
