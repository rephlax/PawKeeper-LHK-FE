import React, { useCallback } from 'react'
import { Edit, MessageCircle, Star } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'
import { useChat } from '../../context/ChatContext'

const PinCard = ({
  pin,
  index,
  user,
  onEdit,
  onReview,
  isSelected,
  onClick,
}) => {
  const isOwnPin = pin.user === user?._id
  const { isOpen, setIsOpen } = useChat()
  const { startPrivateChat, socket } = useSocket()

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
      className={`
        p-4 mb-2 rounded-lg cursor-pointer transition-all
        ${isSelected ? 'bg-cream-100 border-2 border-cream-500' : 'bg-white hover:bg-cream-50'}
        shadow-sm
      `}
    >
      <div className='flex items-start gap-3'>
        <div
          className={`
          w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
          ${isOwnPin ? 'bg-blue-500' : 'bg-green-500'}
        `}
        >
          {index + 1}
        </div>
        <div className='flex-1'>
          <h3 className='font-bold text-lg'>{pin.title}</h3>
          <p className='text-gray-600 text-sm mb-2'>{pin.description}</p>

          <div className='text-sm text-gray-600 space-y-1'>
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
            <div className='mt-3 space-x-2'>
              {isOwnPin ? (
                <button
                  onClick={e => handleEdit(e, pin)}
                  className='px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1 text-sm'
                >
                  <Edit className='w-4 h-4' />
                  Edit Pin
                </button>
              ) : (
                <>
                  <button
                    onClick={e => handleChatClick(e, pin.user)}
                    className='px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-1 text-sm'
                  >
                    <MessageCircle className='w-4 h-4' />
                    Chat
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      onReview(pin)
                    }}
                    className='px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center gap-1 text-sm'
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
}) => {
  const safePins = Array.isArray(pins) ? pins : []

  if (!safePins.length) {
    return (
      <div className='p-4 text-center text-gray-500'>
        No pins found in this area
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
        />
      ))}
    </div>
  )
}

export default PinList
