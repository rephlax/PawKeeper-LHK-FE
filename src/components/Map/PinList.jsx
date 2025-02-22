import React, { useCallback, useState, useEffect } from 'react'
import { Edit, MessageCircle, Star, Delete, MapPin } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'
import { useChat } from '../../context/ChatContext'
import { calculateAverageRating } from './utils/ratingUtils'
import { handlePinDelete } from './utils/pinHandlers'

const PinCard = ({
  pin,
  index,
  user,
  onEdit,
  onReview,
  isSelected,
  onClick,
  setPins,
}) => {
  const isOwnPin = pin.user === user?._id
  const { isOpen, setIsOpen } = useChat()
  const { startPrivateChat, socket } = useSocket()
  const [averageRating, setAverageRating] = useState(0)
  const [loadingRating, setLoadingRating] = useState(true)

  const userId = pin.user?._id || pin.userId || pin.user

  // Card container
  const cardContainerStyle = {
    padding: '1rem',
    marginBottom: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderWidth: isSelected ? '2px' : '1px',
    borderStyle: 'solid',
  }

  // Content container
  const contentContainerStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  }

  // Index badge
  const indexBadgeStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    color: 'white',
  }

  // Content wrapper
  const contentWrapperStyle = {
    flex: '1',
  }

  // Title
  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.125rem',
  }

  // Description
  const descriptionStyle = {
    fontSize: '0.875rem',
    marginBottom: '0.5rem',
  }

  // Info container
  const infoContainerStyle = {
    fontSize: '0.875rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  }

  // Rating display
  const ratingDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  // Star icon
  const starIconStyle = {
    width: '1rem',
    height: '1rem',
  }

  // Label
  const labelStyle = {
    fontWeight: '500',
  }

  // Actions container
  const actionsContainerStyle = {
    marginTop: '0.75rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  }

  // Button base
  const buttonBaseStyle = {
    padding: '0.25rem 0.75rem',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
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

  // Delete button hover
  const handleDeleteButtonHover = e => {
    e.target.classList.remove('bg-red-500')
    e.target.classList.add('bg-red-600')
  }

  const handleDeleteButtonLeave = e => {
    e.target.classList.remove('bg-red-600')
    e.target.classList.add('bg-red-500')
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

  // Button icon
  const buttonIconStyle = {
    width: '1rem',
    height: '1rem',
  }

  useEffect(() => {
    if (!userId) {
      console.error('User ID not found in pin:', pin)
      setAverageRating(0)
      setLoadingRating(false)
      return
    }

    const fetchRating = async () => {
      try {
        const rating = await calculateAverageRating(userId)
        setAverageRating(rating)
      } catch (error) {
        console.error('Error fetching rating:', error)
        setAverageRating(0)
      } finally {
        setLoadingRating(false)
      }
    }

    fetchRating()
  }, [userId])

  const handleChatClick = async (e, userId) => {
    e.stopPropagation()
    try {
      if (!isOpen) {
        setIsOpen(true)
      }
      const room = await startPrivateChat(userId)
      if (room) {
        socket.emit('join_room', room._id)
        socket.emit('get_rooms')
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  const handleEdit = useCallback(
    (e, pin) => {
      e.stopPropagation()
      if (onEdit) {
        onEdit(pin)
      }
    },
    [onEdit],
  )

  return (
    <div
      onClick={onClick}
      style={cardContainerStyle}
      className={`${
        isSelected
          ? 'bg-cream-100 border-cream-500'
          : 'bg-white hover:bg-cream-50 border-cream-200'
      }`}
    >
      <div style={contentContainerStyle}>
        <div
          style={indexBadgeStyle}
          className={isOwnPin ? 'bg-cream-600' : 'bg-cream-500'}
        >
          {index + 1}
        </div>

        <div style={contentWrapperStyle}>
          <h3 style={titleStyle} className='text-cream-800'>
            {pin.title}
          </h3>
          <p style={descriptionStyle} className='text-cream-600'>
            {pin.description}
          </p>

          <div style={infoContainerStyle} className='text-cream-600'>
            <p>
              {loadingRating ? (
                'Loading rating...'
              ) : averageRating > 0 ? (
                <span style={ratingDisplayStyle}>
                  <Star
                    style={starIconStyle}
                    className='fill-cream-500 text-cream-500'
                  />
                  {averageRating.toFixed(1)}/5
                </span>
              ) : (
                'No ratings yet'
              )}
            </p>
            <p>
              <span style={labelStyle}>Services:</span>{' '}
              {pin.services.join(', ')}
            </p>
            <p>
              <span style={labelStyle}>Availability:</span> {pin.availability}
            </p>
            <p>
              <span style={labelStyle}>Rate:</span> ${pin.hourlyRate}/hr
            </p>
          </div>

          {user && (
            <div style={actionsContainerStyle}>
              {isOwnPin ? (
                <>
                  <button
                    onClick={e => handleEdit(e, pin)}
                    style={buttonBaseStyle}
                    className='bg-cream-600 text-white'
                    onMouseOver={handlePrimaryButtonHover}
                    onMouseOut={handlePrimaryButtonLeave}
                  >
                    <Edit style={buttonIconStyle} />
                    Edit Pin
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handlePinDelete(pin._id, socket, setPins)
                    }}
                    style={buttonBaseStyle}
                    className='bg-red-500 text-white'
                    onMouseOver={handleDeleteButtonHover}
                    onMouseOut={handleDeleteButtonLeave}
                  >
                    <Delete style={buttonIconStyle} />
                    Delete Pin
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={e => handleChatClick(e, pin.user)}
                    style={buttonBaseStyle}
                    className='bg-cream-600 text-white'
                    onMouseOver={handlePrimaryButtonHover}
                    onMouseOut={handlePrimaryButtonLeave}
                  >
                    <MessageCircle style={buttonIconStyle} />
                    Chat
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onReview(pin)
                    }}
                    style={{
                      ...buttonBaseStyle,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                    }}
                    className='border-cream-400 text-cream-700 bg-transparent'
                    onMouseOver={handleSecondaryButtonHover}
                    onMouseOut={handleSecondaryButtonLeave}
                  >
                    <Star style={buttonIconStyle} />
                    Review
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const PinList = ({
  pins = [],
  user,
  selectedPin,
  onPinSelect,
  onStartChat,
  onReview,
  onEdit,
  setPins,
}) => {
  const safePins = Array.isArray(pins) ? pins : []

  // Empty state container
  const emptyStateStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '1rem',
  }

  // Empty state icon
  const emptyIconStyle = {
    width: '2rem',
    height: '2rem',
    marginBottom: '0.5rem',
  }

  // List container
  const listContainerStyle = {
    height: '100%',
    overflowY: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  }

  if (!safePins.length) {
    return (
      <div style={emptyStateStyle} className='text-cream-600'>
        <MapPin style={emptyIconStyle} />
        <p>No pins found in this area</p>
      </div>
    )
  }

  return (
    <div style={listContainerStyle}>
      {safePins.map((pin, index) => (
        <PinCard
          key={pin._id}
          pin={pin}
          index={index}
          user={user}
          isSelected={selectedPin?._id === pin._id}
          onClick={() => onPinSelect(pin)}
          onReview={onReview}
          onEdit={onEdit}
          onStartChat={onStartChat}
          setPins={setPins}
        />
      ))}
    </div>
  )
}

export default PinList
