import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import defaultUser from '../assets/defaultUser.png'
import defaultPet from '../assets/defaultPet.png'
import { useEffect, useState } from 'react'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
import { useTranslation } from 'react-i18next'

const UserPage = () => {
  const { t } = useTranslation()
  const [userInfo, setUserInfo] = useState({})
  const [pets, setPets] = useState([])
  const { user, handleLogout, handleDeleteUser, isSitter, updateSitterStatus } =
    useAuth()
  const { userId } = useParams()
  const webToken = localStorage.getItem('authToken')

  useEffect(() => {
    async function getOneUser() {
      try {
        const userData = await axios.get(
          `${BACKEND_URL}/users/user/${userId}`,
          {
            headers: { authorization: `Bearer ${webToken}` },
          },
        )
        setUserInfo(userData.data)
      } catch (error) {
        console.log(error)
      }
    }

    async function getAllPets() {
      try {
        const userPets = await axios.get(`${BACKEND_URL}/pets/${userId}`, {
          headers: { authorization: `Bearer ${webToken}` },
        })
        setPets(userPets.data)
      } catch (error) {
        console.log(error)
      }
    }

    if (userId) {
      getOneUser()
      getAllPets()
    }
  }, [userId])

  const handleSitterToggle = async () => {
    const success = await updateSitterStatus(!isSitter())
    if (success) {
      setUserInfo(prev => ({
        ...prev,
        sitter: !prev.sitter,
      }))
    }
  }

  async function handleDeletePet(id) {
    const deletedPet = await axios.delete(`${BACKEND_URL}/pets/${id}`, {
      headers: { authorization: `Bearer ${webToken}` },
    })
    const filteredPets = pets.filter(pet => pet._id !== id)
    setPets(filteredPets)
  }

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-8'>
      <h1 className='text-3xl font-bold text-cream-800 text-center'>
        {t('userpage.title')}
      </h1>

      {userInfo && userInfo ? (
        <div className='space-y-8'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='relative w-48 h-48'>
              <img
                src={userInfo.profilePicture || defaultUser}
                className='w-full h-full object-cover rounded-full border-4 border-cream-200'
                alt={userInfo.profilePicture ? 'Profile' : 'Default profile'}
              />
            </div>

            <h2 className='text-2xl font-semibold text-cream-700'>
              {t('userpage.welcome')}, {userInfo.username}!
            </h2>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 space-y-4 border border-cream-200'>
            <div className='grid gap-4'>
              <p className='flex justify-between'>
                <span className='font-medium text-cream-700'>
                  {t('forms.emailLabel')}:
                </span>
                <span className='text-cream-600'>{userInfo.email}</span>
              </p>
              <p className='flex justify-between'>
                <span className='font-medium text-cream-700'>
                  {t('userpage.rating')}:
                </span>
                <span className='text-cream-600'>{userInfo.rating}</span>
              </p>
            </div>

            {/* Sitter Status Toggle */}
            {user && user._id === userId && (
              <div className='py-4 border-t border-cream-200'>
                <p className='text-cream-700 mb-2'>
                  Sitter Status:
                  <span
                    className={
                      userInfo.sitter ? 'text-green-600' : 'text-cream-600'
                    }
                  >
                    {userInfo.sitter ? ' Active' : ' Inactive'}
                  </span>
                </p>
                <button
                  onClick={handleSitterToggle}
                  className='w-full bg-cream-600 text-white px-4 py-2 rounded-lg 
                           hover:bg-cream-700 transition-colors duration-200'
                >
                  {userInfo.sitter
                    ? 'Deactivate Sitter Status'
                    : 'Become a Sitter'}
                </button>
              </div>
            )}
          </div>

          {/* Pets Section */}
          <div className='bg-white rounded-lg shadow-md p-6 space-y-6 border border-cream-200'>
            <h3 className='text-xl font-semibold text-cream-800'>
              {t('userpage.pets.allpets')}
            </h3>

            <div className='space-y-4'>
              {pets.length > 0 ? (
                pets.map((pet, index) => (
                  <div
                    key={pet._id || index}
                    className='p-4 bg-cream-50 rounded-lg space-y-2'
                  >
                    <div className='grid gap-2'>
                      <p>
                        <span className='font-medium text-cream-700'>
                          {t('userpage.pets.name')}:
                        </span>
                        <span className='ml-2 text-cream-600'>
                          {pet.petName}
                        </span>
                      </p>
                      <p>
                        <span className='font-medium text-cream-700'>
                          {t('userpage.pets.age')}:
                        </span>
                        <span className='ml-2 text-cream-600'>
                          {pet.petAge}
                        </span>
                      </p>
                      <p>
                        <span className='font-medium text-cream-700'>
                          {t('userpage.pets.species')}:
                        </span>
                        <span className='ml-2 text-cream-600'>
                          {pet.petSpecies}
                        </span>
                      </p>
                    </div>

                    <div className='flex gap-2 pt-2'>
                      <button
                        onClick={() => handleDeletePet(pet._id)}
                        className='px-3 py-1 bg-red-500 text-white rounded-lg 
                                 hover:bg-red-600 transition-colors duration-200'
                      >
                        {t('userpage.pets.deletepet')}
                      </button>

                      <Link to={`/pets/update-pet/${userId}/${pet._id}`}>
                        <button
                          className='px-3 py-1 bg-cream-600 text-white rounded-lg 
                                       hover:bg-cream-700 transition-colors duration-200'
                        >
                          Update Pet Info
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-cream-600 text-center py-4'>
                  {t('userpage.pets.nopets')}.
                </p>
              )}

              <Link to={`/pets/add-pet/${userId}`}>
                <button
                  className='w-full bg-green-500 text-white px-4 py-2 rounded-lg 
                               hover:bg-green-600 transition-colors duration-200'
                >
                  {t('userpage.pets.addpet')}
                </button>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='space-y-3'>
            <Link to={`/users/update-user/${userId}`} className='block'>
              <button
                className='w-full bg-cream-600 text-white px-4 py-2 rounded-lg 
                             hover:bg-cream-700 transition-colors duration-200'
              >
                {t('userpage.update')}
              </button>
            </Link>

            <button
              onClick={handleDeleteUser}
              className='w-full bg-red-500 text-white px-4 py-2 rounded-lg 
                       hover:bg-red-600 transition-colors duration-200'
            >
              {t('userpage.deleteuser')}
            </button>

            <button
              onClick={handleLogout}
              className='w-full bg-cream-400 text-white px-4 py-2 rounded-lg 
                       hover:bg-cream-500 transition-colors duration-200'
            >
              {t('userpage.logout')}
            </button>

            <Link
              to={`/users/update-user/${userId}/password-change`}
              className='block'
            >
              <button
                className='w-full bg-cream-600 text-white px-4 py-2 rounded-lg 
                             hover:bg-cream-700 transition-colors duration-200'
              >
                {t('userpage.newpass')}
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cream-600'></div>
          <p className='ml-3 text-cream-600'>{t('userpage.loading')}...</p>
        </div>
      )}
    </div>
  )
}

export default UserPage
