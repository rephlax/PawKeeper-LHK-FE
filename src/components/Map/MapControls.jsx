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
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  // Main container
  const mainContainerStyle = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Form container
  const formContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow:
      '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  }

  // Error message
  const errorMessageStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '0.5rem',
  }

  // Heading
  const headingStyle = {
    fontSize: '1.125rem',
    fontWeight: '500',
  }

  // Section container
  const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // Button
  const basicButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  }

  // Basic button hover
  const handleBasicButtonHover = e => {
    e.target.classList.remove('bg-transparent')
    e.target.classList.add('bg-cream-50')
  }

  const handleBasicButtonLeave = e => {
    e.target.classList.remove('bg-cream-50')
    e.target.classList.add('bg-transparent')
  }

  // Icon
  const iconStyle = {
    height: '1rem',
    width: '1rem',
    marginRight: '0.5rem',
  }

  // Search container
  const searchContainerStyle = {
    position: 'relative',
    display: 'flex',
  }

  // Search icon
  const searchIconStyle = {
    position: 'absolute',
    right: '0.5rem',
    top: '50%',
    transform: 'translateY(-50%)',
    height: '1rem',
    width: '1rem',
  }

  // Search input container
  const searchInputContainerStyle = {
    flex: '1',
    position: 'relative',
  }

  // Search input
  const searchInputStyle = {
    width: '100%',
    padding: '0.375rem 0.75rem',
    paddingRight: '2rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  }

  // Search results container
  const searchResultsStyle = {
    position: 'absolute',
    width: '100%',
    zIndex: '10',
    marginTop: '0.25rem',
    backgroundColor: 'white',
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
    borderBottom: '1px solid #fef3c7',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    border: 'none',
  }

  // Search result item hover
  const handleSearchItemHover = e => {
    e.target.style.backgroundColor = '#fef3c7'
  }

  const handleSearchItemLeave = e => {
    e.target.style.backgroundColor = 'white'
  }

  // Action button
  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
  }

  // Primary button hover
  const handlePrimaryButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handlePrimaryButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  // Secondary button hover
  const handleSecondaryButtonHover = e => {
    e.target.classList.remove('bg-transparent')
    e.target.classList.add('bg-cream-50')
  }

  const handleSecondaryButtonLeave = e => {
    e.target.classList.remove('bg-cream-50')
    e.target.classList.add('bg-transparent')
  }

  // Action icon
  const actionIconStyle = {
    height: '1.25rem',
    width: '1.25rem',
  }

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
      <div style={formContainerStyle} className='bg-white'>
        {isCreatingReview ? (
          selectedPin?.user ? (
            <ReviewForm
              onClose={handleCloseForm}
              targetUserId={selectedPin.user}
              sitterName={selectedPin.title}
            />
          ) : (
            <div style={errorMessageStyle} className='text-red-500 bg-red-50'>
              {t('mapcontrols.nositter')}
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
    <div style={mainContainerStyle}>
      <h2 style={headingStyle} className='text-cream-800'>
        {t('mapcontrols.controls')}
      </h2>

      <div style={sectionStyle}>
        <button
          style={basicButtonStyle}
          className='text-cream-700 bg-transparent'
          onMouseOver={handleBasicButtonHover}
          onMouseOut={handleBasicButtonLeave}
        >
          <Compass style={iconStyle} />
          <span>{t('mapcontrols.findlocation')}</span>
        </button>
      </div>

      <div style={sectionStyle}>
        <div style={searchContainerStyle}>
          <Search style={searchIconStyle} className='text-cream-400' />
          <div style={searchInputContainerStyle}>
            <input
              type='text'
              placeholder='Search location...'
              style={searchInputStyle}
              className='border-cream-300'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div style={searchResultsStyle} className='border-cream-200'>
                {searchResults.map(place => (
                  <button
                    key={place.id}
                    onClick={() => handleSearchItemClick(place)}
                    style={searchResultItemStyle}
                    className='text-cream-700 border-cream-100'
                    onMouseOver={handleSearchItemHover}
                    onMouseOut={handleSearchItemLeave}
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
        <div style={sectionStyle}>
          {userPin ? (
            <button
              onClick={handleEditClick}
              style={actionButtonStyle}
              className='text-cream-700 bg-transparent'
              onMouseOver={handleSecondaryButtonHover}
              onMouseOut={handleSecondaryButtonLeave}
            >
              <Edit style={actionIconStyle} />
              <span>{t('mapcontrols.editpin')}</span>
            </button>
          ) : (
            <button
              onClick={handleCreateClick}
              style={actionButtonStyle}
              className='bg-cream-600 text-white'
              onMouseOver={handlePrimaryButtonHover}
              onMouseOut={handlePrimaryButtonLeave}
            >
              <MapPin style={actionIconStyle} />
              <span>{t('mapcontrols.createpin')}</span>
            </button>
          )}
        </div>
      )}

      {selectedPin && selectedPin.user !== user?._id && user && (
        <div style={sectionStyle}>
          <button
            onClick={() => startChat(selectedPin.user)}
            style={actionButtonStyle}
            className='bg-cream-600 text-white'
            onMouseOver={handlePrimaryButtonHover}
            onMouseOut={handlePrimaryButtonLeave}
          >
            <MessageCircle style={actionIconStyle} />
            <span>{t('mapcontrols.chat')}</span>
          </button>
          <button
            onClick={handleReviewClick}
            style={{
              ...actionButtonStyle,
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
            className='border-cream-400 text-cream-700 bg-transparent'
            onMouseOver={handleSecondaryButtonHover}
            onMouseOut={handleSecondaryButtonLeave}
          >
            <Star style={actionIconStyle} />
            <span>{t('mapcontrols.review')}</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default MapControls
