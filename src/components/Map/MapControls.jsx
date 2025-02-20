import { useState, useEffect, useCallback } from 'react'
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
import ReviewForm from './ReviewForm'
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
  setIsEditing,
  editData,
  setEditData,
  userPin,
  selectedPin,
  startChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { isMapLoaded } = useMap()
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
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query,
        )}.json?access_token=${mapboxgl.accessToken}&limit=5`,
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

  const handleCloseForm = useCallback(() => {
    setIsCreatingPin(false)
    setIsCreatingReview(false)
    setIsEditing(false)
    setEditData(null)
    if (socket) {
      socket.emit('toggle_pin_creation', {
        isCreating: false,
        isEditing: false,
      })
    }
  }, [socket, setIsCreatingPin, setIsCreatingReview, setIsEditing, setEditData])

  const handleEditClick = useCallback(() => {
    if (userPin) {
      handlePinEdit(
        setIsCreatingPin,
        setIsEditing,
        setEditData,
        socket,
        userPin,
      )
    }
  }, [socket, userPin, setIsCreatingPin, setIsEditing, setEditData])

  const handleCreateClick = useCallback(() => {
    handlePinCreation(isCreatingPin, setIsCreatingPin, socket)
  }, [isCreatingPin, setIsCreatingPin, socket])

  const handleReviewClick = useCallback(() => {
    setIsCreatingReview(true)
  }, [setIsCreatingReview])

  if (isCreatingPin || isCreatingReview) {
    return (
      <div className='space-y-4 p-6 bg-white rounded-lg shadow-md'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-semibold text-cream-800'>
            {isCreatingReview
              ? 'Write a Review'
              : isEditing
                ? 'Edit Your Pin'
                : 'Create Location Pin'}
          </h2>
          <button
            onClick={handleCloseForm}
            className='p-2 hover:bg-cream-50 rounded-full transition-colors duration-200'
          >
            <X className='h-5 w-5 text-cream-600' />
          </button>
        </div>
        {isCreatingReview ? (
          selectedPin?.user ? (
            <ReviewForm
              onClose={handleCloseForm}
              targetUserId={selectedPin.user}
              sitterName={selectedPin.title}
            />
          ) : (
            <div className='text-red-500 p-4 bg-red-50 rounded-lg'>
              No sitter selected for review
            </div>
          )
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
    <div className='p-4 space-y-4'>
      <h2 className='text-lg font-medium text-cream-800'>Map Controls</h2>

      <div className='space-y-2'>
        <button className='flex items-center w-full px-3 py-2 text-sm text-cream-700 hover:bg-cream-50 rounded-md'>
          <Compass className='h-4 w-4 mr-2' />
          <span>Find My Location</span>
        </button>
      </div>

      <div className='space-y-2'>
        <div className='search-container'>
          <Search className='absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cream-400' />
          <div className='flex-1 relative'>
            <input
              type='text'
              placeholder='Search location...'
              className='w-full px-3 py-1.5 text-sm pr-8 border border-cream-300 rounded-md'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className='search-results'>
                {searchResults.map(place => (
                  <button
                    key={place.id}
                    onClick={() => handleSearchItemClick(place)}
                    className='search-result-item'
                  >
                    {place.place_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {user && user.sitter === true && (
        <div className='space-y-2'>
          {userPin ? (
            <button
              onClick={handleEditClick}
              className='flex items-center space-x-3 w-full p-3 text-cream-700 hover:bg-cream-50 rounded-lg transition-colors duration-200'
            >
              <Edit className='h-5 w-5' />
              <span>Edit Your Pin</span>
            </button>
          ) : (
            <button
              onClick={handleCreateClick}
              className='flex items-center space-x-3 w-full p-3 bg-cream-600 text-white hover:bg-cream-700 rounded-lg transition-colors duration-200'
            >
              <MapPin className='h-5 w-5' />
              <span>Create Location Pin</span>
            </button>
          )}
        </div>
      )}

      {selectedPin && selectedPin.user !== user?._id && user && (
        <div className='space-y-2'>
          <button
            onClick={() => startChat(selectedPin.user)}
            className='flex items-center space-x-3 w-full p-3 bg-cream-600 text-white hover:bg-cream-700 rounded-lg transition-colors duration-200'
          >
            <MessageCircle className='h-5 w-5' />
            <span>Chat with Sitter</span>
          </button>
          <button
            onClick={handleReviewClick}
            className='flex items-center space-x-3 w-full p-3 border-2 border-cream-400 text-cream-700 hover:bg-cream-50 rounded-lg transition-colors duration-200'
          >
            <Star className='h-5 w-5' />
            <span>Leave a Review</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MapControls
