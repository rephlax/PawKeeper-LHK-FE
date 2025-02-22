import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import defaultUser from '../assets/defaultUser.png'
import defaultPet from '../assets/defaultPet.png'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UserPage = () => {
  const { t } = useTranslation()
  const [userInfo, setUserInfo] = useState({})
  const [pets, setPets] = useState([])
  const { user, handleLogout, handleDeleteUser, isSitter, updateSitterStatus } =
    useAuth()
  const { userId } = useParams()
  const webToken = localStorage.getItem('authToken')

  // Container
  const containerStyle = {
    maxWidth: '800px',
    margin: '2rem auto',
    borderRadius: '0.75rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '2rem',
  }

  // Content container
  const contentContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  }

  // Title
  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
  }

  // Profile container
  const profileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  }

  // Profile image container
  const profileImageContainerStyle = {
    position: 'relative',
    width: '12rem',
    height: '12rem',
  }

  // Profile image
  const profileImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '9999px',
    borderWidth: '4px',
    borderStyle: 'solid',
  }

  // Username
  const userNameStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
  }

  // Info card
  const infoCardStyle = {
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Grid container
  const gridContainerStyle = {
    display: 'grid',
    gap: '1rem',
  }

  // Flex between
  const flexBetweenStyle = {
    display: 'flex',
    justifyContent: 'space-between',
  }

  // Label
  const labelStyle = {
    fontWeight: '500',
  }

  // Sitter toggle
  const sitterToggleStyle = {
    paddingTop: '1rem',
    paddingBottom: '1rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // Button
  const buttonStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: 'white',
    fontWeight: '500',
  }

  // Button hover
  const handleButtonHover = (e, fromColor, toColor) => {
    e.target.classList.remove(fromColor)
    e.target.classList.add(toColor)
  }

  const handleButtonLeave = (e, fromColor, toColor) => {
    e.target.classList.remove(fromColor)
    e.target.classList.add(toColor)
  }

  // Pets section extends info card
  const petsSectionStyle = {
    ...infoCardStyle,
    gap: '1.5rem',
  }

  // Pet card
  const petCardStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    gap: '1rem',
  }

  // Pet image container
  const petImageContainerStyle = {
    width: '6rem',
    height: '6rem',
    flexShrink: 0,
  }

  // Pet image
  const petImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  // Pet info
  const petInfoStyle = {
    flex: '1',
    minWidth: '0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }

  // Pet info grid
  const petInfoGridStyle = {
    display: 'grid',
    gap: '0.5rem',
  }

  // Pet actions
  const petActionsStyle = {
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '0.5rem',
  }

  // Link wrapper
  const linkWrapperStyle = {
    textDecoration: 'none',
  }

  // Title for pet section
  const sectionTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
  }

  // Actions container
  const actionsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  }

  // Loading container
  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem 0',
  }

  // Loading spinner
  const loadingSpinnerStyle = {
    animation: 'spin 1s linear infinite',
    borderRadius: '9999px',
    height: '2rem',
    width: '2rem',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'transparent',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
  }

  // Add spinner animation
  const spinKeyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `

  useEffect(() => {
    // Add the keyframes to the document
    const styleElement = document.createElement('style')
    styleElement.innerHTML = spinKeyframes
    document.head.appendChild(styleElement)

    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement)
    }
  }, [])

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
  }, [userId, webToken])

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
    await axios.delete(`${BACKEND_URL}/pets/${id}`, {
      headers: { authorization: `Bearer ${webToken}` },
    })
    const filteredPets = pets.filter(pet => pet._id !== id)
    setPets(filteredPets)
  }

  return (
    <div style={containerStyle} className='bg-white border-cream-200'>
      <div style={contentContainerStyle}>
        <h1 style={titleStyle} className='text-cream-800'>
          {t('userpage.title')}
        </h1>

        {userInfo && userInfo ? (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div style={profileContainerStyle}>
              <div style={profileImageContainerStyle}>
                <img
                  src={userInfo.profilePicture || defaultUser}
                  style={profileImageStyle}
                  className='border-cream-200'
                  alt={userInfo.profilePicture ? 'Profile' : 'Default profile'}
                />
              </div>

              <h2 style={userNameStyle} className='text-cream-700'>
                {t('userpage.welcome')}, {userInfo.username}!
              </h2>
            </div>

            <div style={infoCardStyle} className='bg-white border-cream-200'>
              <div style={gridContainerStyle}>
                <p style={flexBetweenStyle}>
                  <span style={labelStyle} className='text-cream-700'>
                    {t('forms.emailLabel')}:
                  </span>
                  <span className='text-cream-600'>{userInfo.email}</span>
                </p>
                <p style={flexBetweenStyle}>
                  <span style={labelStyle} className='text-cream-700'>
                    {t('userpage.rating')}:
                  </span>
                  <span className='text-cream-600'>{userInfo.rating}</span>
                </p>
              </div>

              {/* Sitter Status Toggle */}
              {user && user._id === userId && (
                <div style={sitterToggleStyle} className='border-cream-200'>
                  <p
                    style={{ marginBottom: '0.5rem' }}
                    className='text-cream-700'
                  >
                    {t('userpage.sitterstatus')}:
                    <span
                      className={
                        userInfo.sitter ? 'text-green-600' : 'text-cream-600'
                      }
                      style={{ marginLeft: '0.5rem' }}
                    >
                      {userInfo.sitter
                        ? t('userpage.active')
                        : t('userpage.inactive')}
                    </span>
                  </p>
                  <button
                    onClick={handleSitterToggle}
                    style={buttonStyle}
                    className='bg-cream-600'
                    onMouseOver={e =>
                      handleButtonHover(e, 'bg-cream-600', 'bg-cream-700')
                    }
                    onMouseOut={e =>
                      handleButtonLeave(e, 'bg-cream-700', 'bg-cream-600')
                    }
                  >
                    {userInfo.sitter
                      ? t('userpage.deactivatesitterstatus')
                      : t('userpage.becomesitter')}
                  </button>
                </div>
              )}
            </div>

            {/* Pets Section */}
            <div style={petsSectionStyle} className='bg-white border-cream-200'>
              <h3 style={sectionTitleStyle} className='text-cream-800'>
                {t('userpage.pets.allpets')}
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                {pets.length > 0 ? (
                  pets.map((pet, index) => (
                    <div
                      key={pet._id || index}
                      style={petCardStyle}
                      className='bg-cream-50'
                    >
                      {/* Pet Image */}
                      <div style={petImageContainerStyle}>
                        <img
                          src={pet.petPicture || defaultPet}
                          alt={pet.petName || 'Pet'}
                          style={petImageStyle}
                          className='border-cream-200'
                        />
                      </div>

                      {/* Pet Info */}
                      <div style={petInfoStyle}>
                        <div style={petInfoGridStyle}>
                          <p>
                            <span style={labelStyle} className='text-cream-700'>
                              {t('userpage.pets.name')}:
                            </span>
                            <span
                              className='text-cream-600'
                              style={{ marginLeft: '0.5rem' }}
                            >
                              {pet.petName}
                            </span>
                          </p>
                          <p>
                            <span style={labelStyle} className='text-cream-700'>
                              {t('userpage.pets.age')}:
                            </span>
                            <span
                              className='text-cream-600'
                              style={{ marginLeft: '0.5rem' }}
                            >
                              {pet.petAge}
                            </span>
                          </p>
                          <p>
                            <span style={labelStyle} className='text-cream-700'>
                              {t('userpage.pets.species')}:
                            </span>
                            <span
                              className='text-cream-600'
                              style={{ marginLeft: '0.5rem' }}
                            >
                              {pet.petSpecies}
                            </span>
                          </p>
                        </div>

                        <div style={petActionsStyle}>
                          <button
                            onClick={() => handleDeletePet(pet._id)}
                            style={{
                              ...buttonStyle,
                              padding: '0.25rem 0.75rem',
                            }}
                            className='bg-red-500'
                            onMouseOver={e =>
                              handleButtonHover(e, 'bg-red-500', 'bg-red-600')
                            }
                            onMouseOut={e =>
                              handleButtonLeave(e, 'bg-red-600', 'bg-red-500')
                            }
                          >
                            {t('userpage.pets.deletepet')}
                          </button>

                          <Link
                            to={`/pets/update-pet/${userId}/${pet._id}`}
                            style={linkWrapperStyle}
                          >
                            <button
                              style={{
                                ...buttonStyle,
                                padding: '0.25rem 0.75rem',
                              }}
                              className='bg-cream-600'
                              onMouseOver={e =>
                                handleButtonHover(
                                  e,
                                  'bg-cream-600',
                                  'bg-cream-700',
                                )
                              }
                              onMouseOut={e =>
                                handleButtonLeave(
                                  e,
                                  'bg-cream-700',
                                  'bg-cream-600',
                                )
                              }
                            >
                              {t('userpage.pets.update')}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p
                    style={{ textAlign: 'center', padding: '1rem 0' }}
                    className='text-cream-600'
                  >
                    {t('userpage.pets.nopets')}.
                  </p>
                )}

                <Link to={`/pets/add-pet/${userId}`} style={linkWrapperStyle}>
                  <button
                    style={buttonStyle}
                    className='bg-green-500'
                    onMouseOver={e =>
                      handleButtonHover(e, 'bg-green-500', 'bg-green-600')
                    }
                    onMouseOut={e =>
                      handleButtonLeave(e, 'bg-green-600', 'bg-green-500')
                    }
                  >
                    {t('userpage.pets.addpet')}
                  </button>
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={actionsContainerStyle}>
              <Link
                to={`/users/update-user/${userId}`}
                style={linkWrapperStyle}
              >
                <button
                  style={buttonStyle}
                  className='bg-cream-600'
                  onMouseOver={e =>
                    handleButtonHover(e, 'bg-cream-600', 'bg-cream-700')
                  }
                  onMouseOut={e =>
                    handleButtonLeave(e, 'bg-cream-700', 'bg-cream-600')
                  }
                >
                  {t('userpage.update')}
                </button>
              </Link>

              <button
                onClick={handleDeleteUser}
                style={buttonStyle}
                className='bg-red-500'
                onMouseOver={e =>
                  handleButtonHover(e, 'bg-red-500', 'bg-red-600')
                }
                onMouseOut={e =>
                  handleButtonLeave(e, 'bg-red-600', 'bg-red-500')
                }
              >
                {t('userpage.deleteuser')}
              </button>

              <button
                onClick={handleLogout}
                style={buttonStyle}
                className='bg-cream-400'
                onMouseOver={e =>
                  handleButtonHover(e, 'bg-cream-400', 'bg-cream-500')
                }
                onMouseOut={e =>
                  handleButtonLeave(e, 'bg-cream-500', 'bg-cream-400')
                }
              >
                {t('userpage.logout')}
              </button>

              <Link
                to={`/users/update-user/${userId}/password-change`}
                style={linkWrapperStyle}
              >
                <button
                  style={buttonStyle}
                  className='bg-cream-600'
                  onMouseOver={e =>
                    handleButtonHover(e, 'bg-cream-600', 'bg-cream-700')
                  }
                  onMouseOut={e =>
                    handleButtonLeave(e, 'bg-cream-700', 'bg-cream-600')
                  }
                >
                  {t('userpage.newpass')}
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div style={loadingContainerStyle}>
            <div
              style={loadingSpinnerStyle}
              className='border-b-cream-600'
            ></div>
            <p style={{ marginLeft: '0.75rem' }} className='text-cream-600'>
              {t('userpage.loading')}...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserPage
