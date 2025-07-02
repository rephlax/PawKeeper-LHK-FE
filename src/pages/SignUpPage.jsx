import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { debounce } from 'lodash'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const SignUpPage = () => {
  const { t } = useTranslation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [rate, setRate] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [sitter, setSitter] = useState(false)
  const [rating, setRating] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const nav = useNavigate()

  // Container
  const containerStyle = {
    width: '100%',
    maxWidth: '42rem',
    margin: '0 auto',
    padding: '2rem',
  }

  // Title
  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
  }

  // Form
  const formStyle = {
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  }

  // Label
  const labelBlockStyle = {
    display: 'block',
    marginBottom: '1rem',
  }

  // Label text
  const labelTextStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'block',
    marginBottom: '0.25rem',
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
    outline: 'none',
  }

  // Input focus/blur
  const handleInputFocus = e => {
    e.target.classList.remove('border-cream-300')
    e.target.classList.add(
      'border-cream-500',
      'ring-2',
      'ring-cream-300',
      'ring-opacity-50',
    )
  }

  const handleInputBlur = e => {
    e.target.classList.remove(
      'border-cream-500',
      'ring-2',
      'ring-cream-300',
      'ring-opacity-50',
    )
    e.target.classList.add('border-cream-300')
  }

  // Checkbox container
  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
  }

  // Checkbox
  const checkboxStyle = {
    height: '1.25rem',
    width: '1.25rem',
    borderRadius: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Checkbox label
  const checkboxLabelStyle = {
    marginLeft: '0.5rem',
  }

  // Sitter section
  const sitterSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    paddingTop: '1rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // Location container
  const locationContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Search results container
  const searchResultsContainerStyle = {
    position: 'absolute',
    zIndex: '10',
    width: '100%',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxHeight: '15rem',
    overflowY: 'auto',
  }

  // Search result item
  const searchResultItemStyle = {
    width: '100%',
    padding: '0.75rem',
    textAlign: 'left',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    cursor: 'pointer',
    border: 'none',
  }

  // Location button
  const locationButtonStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
    color: 'white',
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

  // Grid container
  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  }

  // Submit button
  const submitButtonStyle = {
    width: '100%',
    marginTop: '1.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
    color: 'white',
    fontWeight: '500',
  }

  // Upload button
  const uploadButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
    color: 'white',
  }

  // File input
  const fileInputStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
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
      console.log(profilePicture)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const searchPlaces = debounce(async query => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${mapboxgl.accessToken}&limit=5`,
      )

      const data = await response.json()
      setSearchResults(data.features)
    } catch (error) {
      console.error('Search error:', error)
    }
  }, 500)

  useEffect(() => {
    searchPlaces(searchQuery)
  }, [searchQuery])

  const handlePlaceSelect = place => {
    setLatitude(place.center[1])
    setLongitude(place.center[0])
    setSearchQuery(place.place_name)
    setSearchResults([])
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)

          fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${mapboxgl.accessToken}`,
          )
            .then(response => response.json())
            .then(data => {
              if (data.features?.length > 0) {
                setSearchQuery(data.features[0].place_name)
              }
            })
        },
        error => {
          console.error('Error getting location:', error)
          alert('Unable to retrieve your location')
        },
      )
    } else {
      alert('Geolocation is not supported by your browser')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (sitter && (!rate || !latitude || !longitude)) {
      alert('Sitters must provide their rate and location')
      return
    }

    const newUser = {
      username,
      email,
      password,
      profilePicture,
      rate: sitter ? rate : 0,
      latitude,
      longitude,
      sitter,
      rating,
    }

    try {
      const existingUsers = await axios.get(`${BACKEND_URL}/users/`)
      const userExists = existingUsers.data.some(
        user => user.username === newUser.username,
      )
      const emailExists = existingUsers.data.some(
        user => user.email === newUser.email,
      )

      if (userExists) {
        alert('User already exists')
      } else if (emailExists) {
        alert('Email already exists')
      } else {
        const response = await axios.post(
          `${BACKEND_URL}/users/signup`,
          newUser,
        )

        if (response.data) {
          alert('User created successfully')
          clearForm()
          nav('/log-in')
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert(error.response?.data?.message || 'Error creating user')
    }
  }

  const clearForm = () => {
    setUsername('')
    setEmail('')
    setPassword('')
    setProfilePicture('')
    setLatitude('')
    setLongitude('')
    setRate('')
    setSitter(false)
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle} className='text-cream-800'>
        {t('signuppage.title')}
      </h1>

      <form
        onSubmit={handleSubmit}
        style={formStyle}
        className='bg-white border-cream-200'
      >
        {/* Basic Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={labelBlockStyle}>
            <span style={labelTextStyle} className='text-cream-700'>
              {t('forms.emailLabel')}
            </span>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
              className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </label>

          <label style={labelBlockStyle}>
            <span style={labelTextStyle} className='text-cream-700'>
              {t('forms.passwordLabel')}
            </span>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
              className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </label>

          <label style={labelBlockStyle}>
            <span style={labelTextStyle} className='text-cream-700'>
              {t('signuppage.usernameLabel')}
            </span>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={inputStyle}
              className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </label>

          {/* Profile Picture Upload */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <span style={labelTextStyle} className='text-cream-700'>
              {t('signuppage.profilePictureLabel')}
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                style={fileInputStyle}
                className='border-cream-300 text-cream-700'
              />
              <button
                type='button'
                onClick={handleUpload}
                disabled={uploading}
                style={uploadButtonStyle}
                className={
                  uploading ? 'bg-cream-400 cursor-not-allowed' : 'bg-cream-600'
                }
                onMouseOver={e => {
                  if (!uploading)
                    handleButtonHover(e, 'bg-cream-600', 'bg-cream-700')
                }}
                onMouseOut={e => {
                  if (!uploading)
                    handleButtonLeave(e, 'bg-cream-700', 'bg-cream-600')
                }}
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Sitter Toggle */}
        <div style={checkboxContainerStyle}>
          <label style={{ display: 'inline-flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              checked={sitter}
              onChange={e => setSitter(e.target.checked)}
              style={checkboxStyle}
              className='text-cream-600 border-cream-300'
            />
            <span style={checkboxLabelStyle} className='text-cream-700'>
              {t('signuppage.sitterLabel')}
            </span>
          </label>
        </div>

        {/* Sitter-specific Fields */}
        {sitter && (
          <div style={sitterSectionStyle} className='border-cream-200'>
            <label style={labelBlockStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.rateLabel')}
              </span>
              <input
                type='number'
                value={rate}
                onChange={e => setRate(e.target.value)}
                required={sitter}
                min='0'
                style={inputStyle}
                className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <div style={locationContainerStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('signuppage.locationLabel')}
              </span>

              <div style={{ position: 'relative' }}>
                <input
                  type='text'
                  placeholder='Search for a location'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />

                {searchResults.length > 0 && (
                  <div
                    style={searchResultsContainerStyle}
                    className='bg-white border-cream-200'
                  >
                    {searchResults.map(place => (
                      <button
                        key={place.id}
                        type='button'
                        onClick={() => handlePlaceSelect(place)}
                        style={searchResultItemStyle}
                        className='text-cream-700 border-b-cream-100 hover:bg-cream-50'
                        onMouseOver={e => {
                          e.target.classList.add('bg-cream-50')
                        }}
                        onMouseOut={e => {
                          e.target.classList.remove('bg-cream-50')
                        }}
                      >
                        {place.place_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type='button'
                onClick={getCurrentLocation}
                style={locationButtonStyle}
                className='bg-cream-500'
                onMouseOver={e =>
                  handleButtonHover(e, 'bg-cream-500', 'bg-cream-600')
                }
                onMouseOut={e =>
                  handleButtonLeave(e, 'bg-cream-600', 'bg-cream-500')
                }
              >
                Get Current Location
              </button>

              <div style={gridContainerStyle}>
                <label style={labelBlockStyle}>
                  <span style={labelTextStyle} className='text-cream-700'>
                    {t('signuppage.latitudePlaceholder')}
                  </span>
                  <input
                    type='number'
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    required={sitter}
                    style={inputStyle}
                    className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </label>

                <label style={labelBlockStyle}>
                  <span style={labelTextStyle} className='text-cream-700'>
                    {t('signuppage.longitudePlaceholder')}
                  </span>
                  <input
                    type='number'
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    required={sitter}
                    style={inputStyle}
                    className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          style={submitButtonStyle}
          className='bg-cream-600'
          onMouseOver={e =>
            handleButtonHover(e, 'bg-cream-600', 'bg-cream-700')
          }
          onMouseOut={e => handleButtonLeave(e, 'bg-cream-700', 'bg-cream-600')}
        >
          {t('signuppage.signupButton')}
        </button>
      </form>
    </div>
  )
}

export default SignUpPage
