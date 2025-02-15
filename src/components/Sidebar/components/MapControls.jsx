import React, { useRef, useState } from 'react'
import { Compass, MapPin, Search, X } from 'lucide-react'
import { Autocomplete } from '@react-google-maps/api'
import { handleLocationRequest } from '../utils/locationHandlers'
import { handlePinCreation } from '../utils/pinHandlers'
import PinForm from '../../Modal/PinForm'

const MapControls = ({
  user,
  socket,
  isCreatingPin,
  setIsCreatingPin,
  isEditing,
  editData,
}) => {
  const autocompleteRef = useRef(null)
  const [searchLocation, setSearchLocation] = useState('')

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace()
    if (!place?.geometry) {
      console.log('No location found for this place')
      return
    }

    // Get coordinates of the selected place
    const location = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    }

    setSearchLocation(place.formatted_address)
    console.log('Selected location:', location)

    // Send the new location to center the map
    if (socket) {
      socket.emit('center_map', location)
      socket.emit('share_location', location)
    }
  }

  const handlePlaceSearch = () => {
    if (!searchLocation.trim()) return

    if (autocompleteRef.current) {
      autocompleteRef.current.getPlace()
    }
  }

  const handleCloseForm = () => {
    setIsCreatingPin(false)
    if (socket) {
      socket.emit('toggle_pin_creation', {
        isCreating: false,
        isEditing: false,
      })
    }
  }

  if (isCreatingPin) {
    return (
      <div className='space-y-4 p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>
            {isEditing ? 'Edit Location Pin' : 'Create Location Pin'}
          </h2>
          <button
            onClick={handleCloseForm}
            className='p-1 hover:bg-gray-100 rounded-full'
          >
            <X className='h-5 w-5' />
          </button>
        </div>
        <PinForm
          onClose={handleCloseForm}
          containerClass='border-none shadow-none p-0'
          isEditing={isEditing}
          initialData={editData}
        />
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

      {user?.sitter && (
        <div className='space-y-2'>
          <button
            onClick={() =>
              handlePinCreation(isCreatingPin, setIsCreatingPin, socket)
            }
            className='flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg'
          >
            <MapPin className='h-5 w-5' />
            <span>Create Location Pin</span>
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
      </div>
    </div>
  )
}

export default MapControls
