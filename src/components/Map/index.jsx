import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, InfoWindow, Marker } from '@react-google-maps/api'
import { useSocket } from '../../context/SocketContext'
import { useAuth } from '../../context/AuthContext'
import { DEFAULT_CENTER, getUserLocation } from './utils/location'
import axios from 'axios'
import { Star, UserCircle } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const MapComponent = () => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const mapRef = useRef(null)
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER)
  const [userPin, setUserPin] = useState(null)
  const [allPins, setAllPins] = useState([])
  const [selectedPin, setSelectedPin] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [mapVisible, setMapVisible] = useState(true)
  const [reviews, setReviews] = useState([])

  const getAuthConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }),
    [],
  )

  const fetchReviews = async userId => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/reviews/reviews/${userId}`,
        getAuthConfig(),
      )
      setReviews(response.data.allReviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    }
  }

  const fetchAllPins = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/all-pins`,
        getAuthConfig(),
      )
      setAllPins(response.data)
    } catch (error) {
      console.error('Error fetching all pins:', error)
    }
  }

  const loadUserPin = async () => {
    if (!user?._id) return

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/search`,
        {
          params: { userId: user._id },
          ...getAuthConfig(),
        },
      )

      if (response.data.length > 0) {
        setUserPin(response.data[0])
      }
    } catch (error) {
      console.error('Error loading user pin:', error)
    }
  }

  const handleMapLoad = map => {
    mapRef.current = map
  }

  const centerMap = location => {
    if (mapRef.current) {
      mapRef.current.panTo(location)
      mapRef.current.setZoom(14)
    }
  }

  const startChat = pinOwner => {
    if (socket) {
      socket.emit('start_private_chat', { targetUserId: pinOwner })
    }
  }

  // Socket and location setup effects
  useEffect(() => {
    if (!user?._id) return

    fetchAllPins()
    loadUserPin()

    const locationHandler = () => {
      getUserLocation(setUserLocation, setLocationError, mapRef.current, socket)
    }

    locationHandler()
    const locationInterval = setInterval(locationHandler, 60000)

    return () => clearInterval(locationInterval)
  }, [user, socket])

  // Socket listeners for pin updates
  useEffect(() => {
    if (!socket) return

    const handlePinUpdate = () => {
      fetchAllPins()
      loadUserPin()
    }

    socket.on('pin_created', handlePinUpdate)
    socket.on('pin_updated', handlePinUpdate)
    socket.on('center_map', centerMap)

    return () => {
      socket.off('pin_created', handlePinUpdate)
      socket.off('pin_updated', handlePinUpdate)
      socket.off('center_map', centerMap)
    }
  }, [socket])

  // Review fetching effect
  useEffect(() => {
    if (selectedPin) {
      fetchReviews(selectedPin.user)
    }
  }, [selectedPin])

  const renderAverageRating = () => {
    if (reviews.length === 0) return null

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

    return (
      <div className='flex items-center text-yellow-500'>
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${index < Math.round(averageRating) ? 'fill-current' : 'stroke-current'}`}
          />
        ))}
        <span className='ml-2 text-sm text-gray-600'>
          ({averageRating.toFixed(1)}, {reviews.length} reviews)
        </span>
      </div>
    )
  }

  const renderReviews = () => {
    if (reviews.length === 0) return null

    return (
      <div className='mt-4 max-h-48 overflow-y-auto'>
        <h4 className='text-sm font-semibold mb-2'>Recent Reviews</h4>
        {reviews.slice(0, 3).map(review => (
          <div key={review._id} className='border-t py-2'>
            <div className='flex items-center space-x-2 mb-1'>
              <UserCircle className='h-5 w-5 text-gray-500' />
              <span className='font-medium text-sm'>{review.title}</span>
              <div className='flex text-yellow-500'>
                {[...Array(review.rating)].map((_, index) => (
                  <Star key={index} className='h-3 w-3 fill-current' />
                ))}
              </div>
            </div>
            <p className='text-xs text-gray-600'>{review.description}</p>
          </div>
        ))}
      </div>
    )
  }

  const renderInfoWindowContent = () => {
    if (!selectedPin) return null

    const isOwnPin = selectedPin.user === user?._id

    // User is not a sitter clicking their home location
    if (!user?.sitter && isOwnPin) {
      return null
    }

    // User is a sitter but hasn't registered a pin
    if (user?.sitter && isOwnPin && !userPin) {
      return (
        <div className='p-4'>
          <h3 className='font-bold text-lg'>Register Your Pin First</h3>
          <p className='mt-2'>
            Use the sidebar "Create Location Pin" button to register your
            services.
          </p>
        </div>
      )
    }

    // View of any pin
    return (
      <div className='p-4 w-72'>
        <h3 className='font-bold text-lg'>{selectedPin.title}</h3>
        <p className='mt-2'>{selectedPin.description}</p>
        <p className='mt-1 text-gray-600'>
          Availability: {selectedPin.availability}
        </p>
        <p className='mt-1 text-gray-600'>Rate: ${selectedPin.hourlyRate}/hr</p>

        {renderAverageRating()}

        {isOwnPin && (
          <p className='mt-2 text-sm text-blue-600'>
            Use the sidebar button to edit your pin
          </p>
        )}
        {!isOwnPin && (
          <div>
            <p className='mt-2 text-sm text-blue-600'>
              Use the sidebar button to chat with this sitter
            </p>
            <button
              onClick={() => startChat(selectedPin.user)}
              className='mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
            >
              Start Chat
            </button>
          </div>
        )}

        {renderReviews()}
      </div>
    )
  }

  return (
    <div className='w-full h-full'>
      <div className={`w-full h-full ${!mapVisible ? 'hidden' : ''}`}>
        {locationError && (
          <div className='absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md'>
            <p>{locationError}</p>
          </div>
        )}

        <GoogleMap
          center={userLocation}
          zoom={14}
          mapContainerClassName='w-full h-full'
          options={{
            mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
            disableDefaultUI: false,
            clickableIcons: false,
            zoomControl: true,
            streetViewControl: true,
          }}
          onLoad={handleMapLoad}
        >
          {allPins.map(pin => (
            <Marker
              key={pin._id}
              position={{
                lat: pin.location.coordinates[1],
                lng: pin.location.coordinates[0],
              }}
              onClick={() => setSelectedPin(pin)}
              title={pin.title}
              icon={
                pin.user === user?._id
                  ? '/path/to/your-pin-icon.png'
                  : '/path/to/other-pin-icon.png'
              }
            />
          ))}

          {selectedPin && (
            <InfoWindow
              position={{
                lat: selectedPin.location.coordinates[1],
                lng: selectedPin.location.coordinates[0],
              }}
              onCloseClick={() => setSelectedPin(null)}
            >
              {renderInfoWindowContent()}
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  )
}

export default MapComponent
