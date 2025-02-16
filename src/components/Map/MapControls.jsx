import React, { useState, useEffect } from 'react'
import {
  Compass,
  MapPin,
  Search,
  X,
  MessageCircle,
  Star,
  Edit,
} from 'lucide-react'
import { useMap } from '../../context/MapContext'
import PinForm from './PinForm'
import { debounce } from 'lodash'
import { handleLocationRequest } from './utils/locationHandlers'
import { handlePinCreation, handlePinEdit } from './utils/pinHandlers'
import mapboxgl from 'mapbox-gl'

const MapControls = ({
  user,
  socket,
  isCreatingPin,
  setIsCreatingPin,
  isCreatingReview,
  setIsCreatingReview,
  isEditing,
  editData,
  userPin,
  selectedPin,
  startChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { map, flyTo } = useMap()

  const searchPlaces = debounce(async query => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${mapboxgl.accessToken}&limit=5`,
      )

      const data = await response.json()
      setSearchResults(data.features)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }, 500)

  useEffect(() => {
    searchPlaces(searchQuery)
  }, [searchQuery])

  const handleSearchItemClick = place => {
    flyTo(place.center)
    setSearchQuery('')
    setSearchResults([])
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
          onClick={() => {
            console.log('Map instance:', map)
            handleLocationRequest(socket, map?.current || map)
          }}
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
            <input
              type='text'
              placeholder='Search location...'
              className='w-full p-2 border rounded'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                {searchResults.map(place => (
                  <button
                    key={place.id}
                    onClick={() => handleSearchItemClick(place)}
                    className='w-full p-2 text-left hover:bg-gray-100 border-b last:border-b-0'
                  >
                    {place.place_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {user?.sitter && (
        <div className='space-y-2'>
          {userPin ? (
            <button
              onClick={() =>
                handlePinEdit(setIsCreatingPin, setIsEditing, socket, userPin)
              }
              className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-blue-100 rounded-lg text-blue-600'
            >
              <Edit className='h-5 w-5' />
              <span>Edit Location Pin</span>
            </button>
          ) : (
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
