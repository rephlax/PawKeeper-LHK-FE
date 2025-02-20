import React, { useCallback } from 'react'
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


  console.log("Here is the user", pin.user)
  const averageRating = calculateAverageRating(pin)

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
      className={`p-4 mb-2 rounded-lg cursor-pointer transition-all duration-200
        ${
          isSelected
            ? 'bg-cream-100 border-2 border-cream-500'
            : 'bg-white hover:bg-cream-50 border border-cream-200'
        }`}
    >
      <div className='flex items-start gap-3'>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
            ${isOwnPin ? 'bg-cream-600' : 'bg-cream-500'}`}
        >
          {index + 1}
        </div>

        <div className='flex-1'>
          <h3 className='font-bold text-lg text-cream-800'>{pin.title}</h3>
          <p className='text-cream-600 text-sm mb-2'>{pin.description}</p>

          <div className='text-sm text-cream-600 space-y-1'>
            <p>
              {averageRating > 0 ? (
                <span className='flex items-center gap-1'>
                  <Star className='w-4 h-4 fill-cream-500 text-cream-500' />
                  {averageRating.toFixed(1)}/5
                </span>
              ) : (
                'No ratings yet'
              )}
            </p>
            <p>
              <span className='font-medium'>Services:</span>{' '}
              {pin.services.join(', ')}
            </p>
            <p>
              <span className='font-medium'>Availability:</span>{' '}
              {pin.availability}
            </p>
            <p>
              <span className='font-medium'>Rate:</span> ${pin.hourlyRate}/hr
            </p>
          </div>

          {user && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {isOwnPin ? (
                <>
                  <button
                    onClick={e => handleEdit(e, pin)}
                    className='px-3 py-1 bg-cream-600 text-white rounded-lg hover:bg-cream-700 
                           transition-colors duration-200 flex items-center gap-1 text-sm'
                  >
                    <Edit className='w-4 h-4' />
                    Edit Pin
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handlePinDelete(pin._id, socket, setPins)
                    }}
                    className='px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 
                           transition-colors duration-200 flex items-center gap-1 text-sm'
                  >
                    <Delete className='w-4 h-4' />
                    Delete Pin
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={e => handleChatClick(e, pin.user)}
                    className='px-3 py-1 bg-cream-600 text-white rounded-lg hover:bg-cream-700 
                             transition-colors duration-200 flex items-center gap-1 text-sm'
                  >
                    <MessageCircle className='w-4 h-4' />
                    Chat
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onReview(pin)
                    }}
                    className='px-3 py-1 border border-cream-400 text-cream-700 rounded-lg 
                             hover:bg-cream-50 transition-colors duration-200 
                             flex items-center gap-1 text-sm'
                  >
                    <Star className='w-4 h-4' />
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

  if (!safePins.length) {
    return (
      <div className='flex flex-col items-center justify-center h-full p-4 text-cream-600'>
        <MapPin className='w-8 h-8 mb-2' />
        <p>No pins found in this area</p>
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto px-4'>
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
