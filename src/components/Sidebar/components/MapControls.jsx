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
  const [searchLocation, setSearchLocation] = useState('')

  const handleLocationSubmit = e => {
    e.preventDefault()
    if (!searchLocation.trim() || !map) return

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ address: searchLocation }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        }
        console.log('Found location:', location)
        map.panTo(location)
        map.setZoom(14)
        if (socket) {
          socket.emit('center_map', location)
        }
      } else {
        alert('Location not found')
      }
    })
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
          onClick={() => handleLocationRequest(socket, map)}
          className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg'
        >
          <Compass className='h-5 w-5' />
          <span>Find My Location</span>
        </button>
      </div>

      <div className='space-y-2'>
        <form
          onSubmit={handleLocationSubmit}
          className='flex items-center space-x-2 p-3'
        >
          <Search className='h-5 w-5' />
          <div className='flex-1 relative'>
            <input
              type='text'
              placeholder='Search location...'
              className='w-full p-2 border rounded'
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Search
          </button>
        </form>
      </div>

      {/* Show Create Pin only if user is sitter without a pin */}
      {user?.sitter && (
        <div className='space-y-2'>
          {userPin ? (
            // Edit Pin Button
            <button
              onClick={() => {
                setIsCreatingPin(true)
                setIsEditing(true)
                if (socket) {
                  socket.emit('toggle_pin_creation', {
                    isCreating: true,
                    isEditing: true,
                    pinData: userPin,
                  })
                }
              }}
              className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-blue-100 rounded-lg text-blue-600'
            >
              <Edit className='h-5 w-5' />
              <span>Edit Location Pin</span>
            </button>
          ) : (
            // Create Pin Button
            <button
              onClick={() =>
                handlePinCreation(isCreatingPin, setIsCreatingPin, socket)
              }
              className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg'
            >
              <MapPin className='h-5 w-5' />
              <span>Create Location Pin</span>
            </button>
          )}
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
