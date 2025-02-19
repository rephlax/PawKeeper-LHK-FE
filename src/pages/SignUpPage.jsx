import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { debounce } from 'lodash'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
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
    <div>
      <h1>{t('signuppage.title')}</h1>
      <form onSubmit={handleSubmit} className='form'>
        <label>
          {t('forms.emailLabel')}
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          {t('forms.passwordLabel')}
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          {t('signuppage.usernameLabel')}
          <input
            type='text'
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          {t('signuppage.profilePictureLabel')}
          <input type='file' accept='image/*' onChange={handleImageChange} />
        </label>
        <button type='button' onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>

        <label>
          {t('signuppage.sitterLabel')}
          <input
            type='checkbox'
            checked={sitter}
            onChange={e => setSitter(e.target.checked)}
          />
        </label>

        {sitter && (
          <>
            <label>
              {t('signuppage.rateLabel')}
              <input
                type='number'
                value={rate}
                onChange={e => setRate(e.target.value)}
                required={sitter}
                min='0'
              />
            </label>

            <div className='location-section'>
              <label>{t('signuppage.locationLabel')}</label>

              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search for a location'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='w-full p-2 border rounded'
                />

                {searchResults.length > 0 && (
                  <div className='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                    {searchResults.map(place => (
                      <button
                        key={place.id}
                        type='button'
                        onClick={() => handlePlaceSelect(place)}
                        className='w-full p-2 text-left hover:bg-gray-100 border-b last:border-b-0'
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
                className='get-location-btn'
              >
                Get Current Location
              </button>

              <div className='coordinates-inputs'>
                <input
                  type='number'
                  placeholder={t('signuppage.latitudePlaceholder')}
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  required={sitter}
                />
                <input
                  type='number'
                  placeholder={t('signuppage.longitudePlaceholder')}
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  required={sitter}
                />
              </div>
            </div>
          </>
        )}

        <button type='submit'>{t('signuppage.signupButton')}</button>
      </form>
    </div>
  )
}

export default SignUpPage
