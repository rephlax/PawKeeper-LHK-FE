import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from './PageWrapper'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UpdateUserForm = () => {
  const { t } = useTranslation()
  const { user, userId } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [rate, setRate] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [sitter, setSitter] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const nav = useNavigate()
  const webToken = localStorage.getItem('authToken')

  // Container
  const containerStyle = {
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Content container
  const contentStyle = {
    padding: '1.5rem',
  }

  // For larger screens
  if (window.innerWidth >= 640) {
    contentStyle.padding = '2rem'
  }

  // Title
  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  }

  // Form
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  }

  // Grid container
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.5rem',
  }

  // For medium screens and above
  if (window.innerWidth >= 768) {
    gridContainerStyle.gridTemplateColumns = 'repeat(2, 1fr)'
  }

  // Label
  const labelStyle = {
    display: 'block',
  }

  // Label text
  const labelTextStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  // Input
  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Input focus
  const handleInputFocus = e => {
    e.target.classList.remove('border-cream-300')
    e.target.classList.add('border-transparent', 'ring-2', 'ring-cream-400')
  }

  // Input blur
  const handleInputBlur = e => {
    e.target.classList.remove('border-transparent', 'ring-2', 'ring-cream-400')
    e.target.classList.add('border-cream-300')
  }

  // File input container
  const fileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // File input wrapper
  const fileWrapperStyle = {
    display: 'flex',
    gap: '0.75rem',
  }

  // File input
  const fileInputStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
  }

  // Upload button
  const uploadButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  // Upload button hover
  const handleUploadButtonHover = e => {
    if (!uploading) {
      e.target.classList.remove('bg-cream-600')
      e.target.classList.add('bg-cream-700')
    }
  }

  const handleUploadButtonLeave = e => {
    if (!uploading) {
      e.target.classList.remove('bg-cream-700')
      e.target.classList.add('bg-cream-600')
    }
  }

  // Location container
  const locationContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    gridColumn: 'span 2',
  }

  // Location grid
  const locationGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  }

  // Checkbox container
  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    gridColumn: 'span 2',
  }

  // Checkbox
  const checkboxStyle = {
    borderRadius: '0.25rem',
  }

  // Button container
  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1.5rem',
  }

  // Submit button
  const submitButtonStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  // Submit button hover
  const handleSubmitButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handleSubmitButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  // Back button
  const backButtonStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  }

  // Back button hover
  const handleBackButtonHover = e => {
    e.target.classList.remove('bg-transparent')
    e.target.classList.add('bg-cream-50')
  }

  const handleBackButtonLeave = e => {
    e.target.classList.remove('bg-cream-50')
    e.target.classList.add('bg-transparent')
  }

  useEffect(() => {
    async function getOneUser() {
      if (webToken) {
        try {
          const userToUpdate = await axios.get(
            `${BACKEND_URL}/users/user/${userId}`,
            {
              headers: {
                authorization: `Bearer ${webToken}`,
              },
            },
          )
          const user = userToUpdate.data
          setUsername(user.username)
          setEmail(user.email)
          setProfilePicture(user.profilePicture)
          setRate(user.rate)
          setLatitude(user.location?.coordinates.latitude || 0)
          setLongitude(user.location?.coordinates.longitude || 0)
          setSitter(user.sitter)
        } catch (error) {
          console.log('Here is the error', error)
        }
      }
    }
    getOneUser()
  }, [userId])

  async function handleUpdateUser(e) {
    e.preventDefault()

    const updatedUser = {
      username,
      email,
      profilePicture,
      rate,
      location: {
        coordinates: {
          latitude,
          longitude,
        },
      },
      sitter,
    }

    console.log(updatedUser)

    if (webToken) {
      try {
        await axios.patch(
          `${BACKEND_URL}/users/update-user/${userId}`,
          updatedUser,
          {
            headers: { authorization: `Bearer ${webToken}` },
          },
        )

        alert('User Updated!')
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.log('Here is the Error', error)
      }
    }
  }

  const handleImageChange = e => {
    setImageFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!imageFile) return

    setUploading(true)

    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'ml_default') // Cloudinary upload preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzdrwiugn/image/upload',
        formData,
      )

      console.log(response)
      setProfilePicture(response.data.secure_url)
      console.log(profilePicture) // Save Cloudinary image URL in state
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={containerStyle} className='bg-white border-cream-200'>
      <div style={contentStyle}>
        <h2 style={titleStyle} className='text-cream-800'>
          Update Profile
        </h2>

        <form style={formStyle} onSubmit={handleUpdateUser}>
          <div style={gridContainerStyle}>
            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('forms.emailLabel')}
              </span>
              <input
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.usernameLabel')}
              </span>
              <input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <div style={fileContainerStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('userupdate.profilePictureLabel')}
              </span>
              <div style={fileWrapperStyle}>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  style={fileInputStyle}
                  className='border-cream-300 text-cream-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-cream-100 file:text-cream-700 hover:file:bg-cream-200'
                />
                <button
                  type='button'
                  onClick={handleUpload}
                  disabled={uploading}
                  style={uploadButtonStyle}
                  className={
                    uploading
                      ? 'bg-cream-400 text-white disabled:cursor-not-allowed'
                      : 'bg-cream-600 text-white'
                  }
                  onMouseOver={handleUploadButtonHover}
                  onMouseOut={handleUploadButtonLeave}
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>

            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.rateLabel')}
              </span>
              <input
                type='number'
                value={rate}
                onChange={e => setRate(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <div style={locationContainerStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.locationLabel')}
              </span>
              <div style={locationGridStyle}>
                <input
                  type='number'
                  placeholder={t('signuppage.latitudePlaceholder')}
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
                <input
                  type='number'
                  placeholder={t('signuppage.longitudePlaceholder')}
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>

            <label style={checkboxContainerStyle}>
              <input
                type='checkbox'
                checked={sitter}
                onChange={e => setSitter(e.target.checked)}
                style={checkboxStyle}
                className='border-cream-300 text-cream-600 focus:ring-cream-400'
              />
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.sitterLabel')}
              </span>
            </label>
          </div>

          <div style={buttonContainerStyle}>
            <button
              type='submit'
              style={submitButtonStyle}
              className='bg-cream-600 text-white'
              onMouseOver={handleSubmitButtonHover}
              onMouseOut={handleSubmitButtonLeave}
            >
              {t('userupdate.submit')}
            </button>
            <Link
              to={`/users/user/${userId}`}
              style={backButtonStyle}
              className='border-cream-400 text-cream-700 bg-transparent'
              onMouseOver={handleBackButtonHover}
              onMouseOut={handleBackButtonLeave}
            >
              {t('userupdate.backbutton')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UpdateUserForm
