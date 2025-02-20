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
    <div className='max-w-2xl mx-auto p-6 space-y-8'>
      <h1 className='text-3xl font-bold text-cream-800 text-center'>
        {t('signuppage.title')}
      </h1>

      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg shadow-lg border border-cream-200 p-6 space-y-6'
      >
        {/* Basic Information */}
        <div className='space-y-4'>
          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('forms.emailLabel')}
            </span>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('forms.passwordLabel')}
            </span>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('signuppage.usernameLabel')}
            </span>
            <input
              type='text'
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>

          {/* Profile Picture Upload */}
          <div className='space-y-2'>
            <span className='text-sm font-medium text-cream-700'>
              {t('signuppage.profilePictureLabel')}
            </span>
            <div className='flex gap-3'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='flex-1 px-4 py-2 border border-cream-300 rounded-lg 
                         text-cream-700 file:mr-4 file:py-2 file:px-4 file:border-0
                         file:text-sm file:font-medium file:bg-cream-100
                         file:text-cream-700 hover:file:bg-cream-200'
              />
              <button
                type='button'
                onClick={handleUpload}
                disabled={uploading}
                className='px-4 py-2 bg-cream-600 text-white rounded-lg
                         hover:bg-cream-700 transition-colors duration-200
                         disabled:bg-cream-400 disabled:cursor-not-allowed'
              >
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>

        {/* Sitter Toggle */}
        <div className='flex items-center gap-2 py-2'>
          <label className='inline-flex items-center'>
            <input
              type='checkbox'
              checked={sitter}
              onChange={e => setSitter(e.target.checked)}
              className='form-checkbox h-5 w-5 text-cream-600 rounded
                       border-cream-300 focus:ring-cream-400'
            />
            <span className='ml-2 text-cream-700'>
              {t('signuppage.sitterLabel')}
            </span>
          </label>
        </div>

        {/* Sitter-specific Fields */}
        {sitter && (
          <div className='space-y-6 pt-4 border-t border-cream-200'>
            <label className='block'>
              <span className='text-sm font-medium text-cream-700'>
                {t('signuppage.rateLabel')}
              </span>
              <input
                type='number'
                value={rate}
                onChange={e => setRate(e.target.value)}
                required={sitter}
                min='0'
                className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                         focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                         transition duration-200'
              />
            </label>

            <div className='space-y-4'>
              <span className='text-sm font-medium text-cream-700'>
                {t('signuppage.locationLabel')}
              </span>

              <div className='relative'>
                <input
                  type='text'
                  placeholder='Search for a location'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />

                {searchResults.length > 0 && (
                  <div
                    className='absolute z-10 w-full mt-1 bg-white border border-cream-200 
                                rounded-lg shadow-lg max-h-60 overflow-y-auto'
                  >
                    {searchResults.map(place => (
                      <button
                        key={place.id}
                        type='button'
                        onClick={() => handlePlaceSelect(place)}
                        className='w-full p-3 text-left hover:bg-cream-50 
                                 border-b border-cream-100 last:border-b-0
                                 text-cream-700 transition-colors duration-200'
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
                className='w-full px-4 py-2 bg-cream-500 text-white rounded-lg
                         hover:bg-cream-600 transition-colors duration-200
                         flex items-center justify-center gap-2'
              >
                Get Current Location
              </button>

              <div className='grid grid-cols-2 gap-4'>
                <label className='block'>
                  <span className='text-sm font-medium text-cream-700'>
                    {t('signuppage.latitudePlaceholder')}
                  </span>
                  <input
                    type='number'
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    required={sitter}
                    className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                             focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                             transition duration-200'
                  />
                </label>

                <label className='block'>
                  <span className='text-sm font-medium text-cream-700'>
                    {t('signuppage.longitudePlaceholder')}
                  </span>
                  <input
                    type='number'
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    required={sitter}
                    className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                             focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                             transition duration-200'
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type='submit'
          className='w-full mt-6 px-4 py-2 bg-cream-600 text-white rounded-lg
                   hover:bg-cream-700 transition-colors duration-200'
        >
          {t('signuppage.signupButton')}
        </button>
      </form>
    </div>
  )
}

export default SignUpPage
