import React, { useRef, useState } from 'react'
import {
  Compass,
  MapPin,
  Search,
  X,
  MessageCircle,
  Star,
  Edit,
} from 'lucide-react'
import { Autocomplete } from '@react-google-maps/api'
import { handleLocationRequest } from '../utils/locationHandlers'
import { handlePinCreation } from '../utils/pinHandlers'
import PinForm from '../../Modal/PinForm'
import ReviewForm from '../../Modal/ReviewForm'

const MapControls = ({
  user,
  socket,
  isCreatingPin,
  setIsCreatingPin,
  isEditing,
  editData,
  userPin,
  selectedPin,
  startChat,
  map,
  isCreatingReview,
  setIsCreatingReview,
}) => {
  const autocompleteRef = useRef(null)
  const [searchLocation, setSearchLocation] = useState('')

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.geometry) {
      console.log('No location found for this place')
      return
    }

    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }

    setSearchLocation(place.formatted_address)
    console.log('Selected location:', location)

    if (socket) {
      socket.emit('center_map', location)
    }
  }

  const handlePlaceSearch = () => {
    if (!searchLocation.trim() || !map) return

    const searchDiv = document.createElement('div')
    const placesService = new google.maps.places.PlacesService(map)

    placesService.findPlaceFromQuery(
      {
        query: searchLocation,
        fields: ['name', 'geometry', 'formatted_address'],
      },
      (results, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          results?.[0]
        ) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          }
          console.log('Found location:', location)

          if (socket) {
            socket.emit('center_map', location)
          }
          map.setCenter(location)
          map.setZoom(14)
        } else {
          console.log('Location search failed:', status)
          alert('Location not found')
        }
      },
    )
  }

  const handleCloseForm = () => {
    setIsCreatingPin(false)
    setIsCreatingReview(false)
    if (socket) {
      socket.emit('toggle_pin_creation', {
        isCreating: false,
        isEditing: false,
      })
    }
  }

  // Show form if creating/editing pin or writing review
  if (isCreatingPin || isCreatingReview) {
    return (
      <div className='space-y-4 p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {isCreatingReview
              ? 'Write a Review'
              : isEditing
                ? 'Edit Location Pin'
                : 'Create Location Pin'}
          </h2>
          <button
            onClick={handleCloseForm}
            className='p-1 hover:bg-gray-100 rounded-full'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        {isCreatingReview ? (
          <ReviewForm
            onClose={handleCloseForm}
            targetUserId={selectedPin.user}
            sitterName={selectedPin.title}
          />
        ) : (
          <PinForm
            onClose={handleCloseForm}
            containerClass='border-none shadow-none p-0'
            isEditing={isEditing}
            initialData={editData}
          />
        )}
      </div>
    )
  }

  return (
    <div className='space-y-6 p-4'>
      <h2 className='text-xl font-semibold mb-6'>Map Controls</h2>

      <div className='space-y-2'>
        <button
          onClick={() => handleLocationRequest(socket)}
          className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg'
        >
          <Compass className='h-5 w-5' />
          <span>Find My Location</span>
        </button>
      </div>

      <div className='space-y-2'>
        <div className='flex items-center space-x-2 p-3'>
          <Search className='h-5 w-5' />
          <div className='flex-1 relative'>
            <Autocomplete
              onLoad={ref => {
                console.log('Autocomplete loaded')
                autocompleteRef.current = ref
              }}
              onPlaceChanged={handlePlaceSelect}
              options={{
                componentRestrictions: { country: 'us' },
                fields: ['geometry.location', 'formatted_address', 'place_id'],
              }}
            >
              <input
                type='text'
                placeholder='Search location...'
                className='w-full p-2 border rounded'
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
              />
            </Autocomplete>
            <button
              onClick={handlePlaceSearch}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600'
            >
              Go
            </button>
          </div>
        </div>
      </div>

      {/* Show Create Pin only if user is sitter without a pin */}
      {user?.sitter && (
        <div className='space-y-2'>
          <button
            onClick={() =>
              handlePinCreation(
                isCreatingPin,
                setIsCreatingPin,
                socket,
                userPin,
              )
            }
            className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg'
          >
            <MapPin className='h-5 w-5' />
            <span>{userPin ? 'Edit Location Pin' : 'Create Location Pin'}</span>
          </button>
        </div>
      )}

      {/* Show Review and Chat buttons when viewing other's pin */}
      {selectedPin && selectedPin.user !== user?._id && (
        <div className='space-y-2'>
          <button
            onClick={() => startChat(selectedPin.user)}
            className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-blue-100 rounded-lg text-blue-600'
          >
            <MessageCircle className='h-5 w-5' />
            <span>Chat with Sitter</span>
          </button>
          <button
            onClick={() => setIsCreatingReview(true)}
            className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-blue-100 rounded-lg text-blue-600'
          >
            <Star className='h-5 w-5' />
            <span>Leave a Review</span>
          </button>
        </div>
      )}

      <div className='mt-8 p-3 text-sm text-gray-500 border-t'>
        <p>Debug Info:</p>
        <p>User logged in: {user ? 'Yes' : 'No'}</p>
        <p>Sitter status: {user?.sitter ? 'Yes' : 'No'}</p>
        <p>Socket connected: {socket ? 'Yes' : 'No'}</p>
        <p>Creating pin: {isCreatingPin ? 'Yes' : 'No'}</p>
        <p>Editing mode: {isEditing ? 'Yes' : 'No'}</p>
        <p>Has pin: {userPin ? 'Yes' : 'No'}</p>
        <p>Selected pin: {selectedPin ? 'Yes' : 'No'}</p>
      </div>
    </div>
  )
}

export default MapControls
