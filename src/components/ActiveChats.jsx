import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import defaultUser from '../assets/defaultUser.png'
import { useTranslation } from 'react-i18next'

const ActiveChats = () => {
  const { t } = useTranslation()
  const [activeRooms, setActiveRooms] = useState([])
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.emit('get_active_rooms')

    socket.on('active_rooms', rooms => {
      console.log('Received active rooms:', rooms)
      setActiveRooms(rooms)
    })

    return () => {
      socket?.off('active_rooms')
    }
  }, [socket])

  const handleChatClick = roomId => {
    if (socket) {
      socket.emit('join_room', roomId)
    }
  }

  return (
    <div className='p-4'>
      <h3 className='font-medium text-cream-800 mb-4'>{t('chat.active')}</h3>
      <div className='space-y-2'>
        {activeRooms.map(room => (
          <div
            key={room._id}
            onClick={() => handleChatClick(room._id)}
            className='flex justify-between items-center p-3 rounded-lg border border-cream-200 
                     hover:bg-cream-50 transition-colors duration-200 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              {room.participants.map(participant => {
                if (participant._id !== socket?.user?._id) {
                  return (
                    <div key={participant._id} className='relative'>
                      <img
                        src={participant.profilePicture || defaultUser}
                        alt={participant.username}
                        className='w-10 h-10 rounded-full object-cover border-2 border-cream-200'
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                          ${room.isActive ? 'bg-green-500' : 'bg-cream-400'}`}
                      />
                    </div>
                  )
                }
                return null
              })}
              <div className='min-w-0 flex-1'>
                <p className='font-medium text-cream-800 truncate'>
                  {room.participants
                    .filter(p => p._id !== socket?.user?._id)
                    .map(p => p.username)
                    .join(', ')}
                </p>
                {room.lastMessage && (
                  <p className='text-sm text-cream-600 truncate'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {activeRooms.length === 0 && (
          <p className='text-cream-600 text-center text-sm py-4'>
            {t('chat.noactive')}
          </p>
        )}
      </div>
    </div>
  )
}

export default ActiveChats
