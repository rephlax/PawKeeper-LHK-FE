import { useState, useEffect } from 'react'
import { useSocket } from '../../../context/SocketContext'
import defaultUser from '../../../assets/defaultUser.png'
import { useTranslation } from 'react-i18next'
import { styles } from './ActiveChats.styles'

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
    <div style={styles.container}>
      <h3 style={styles.heading} className='text-cream-800'>
        {t('chat.active')}
      </h3>
      <div style={styles.listContainer}>
        {activeRooms.map(room => (
          <div
            key={room._id}
            onClick={() => handleChatClick(room._id)}
            style={styles.chatItem}
            className='border-cream-200 hover:bg-cream-50'
          >
            <div style={styles.userInfo}>
              {room.participants.map(participant => {
                if (participant._id !== socket?.user?._id) {
                  return (
                    <div key={participant._id} style={styles.avatarContainer}>
                      <img
                        src={participant.profilePicture || defaultUser}
                        alt={participant.username}
                        style={styles.avatarImage}
                        className='border-cream-200'
                      />
                      <div
                        style={styles.statusIndicator}
                        className={
                          room.isActive ? 'bg-green-500' : 'bg-cream-400'
                        }
                      />
                    </div>
                  )
                }
                return null
              })}
              <div style={styles.textContainer}>
                <p style={styles.username} className='text-cream-800'>
                  {room.participants
                    .filter(p => p._id !== socket?.user?._id)
                    .map(p => p.username)
                    .join(', ')}
                </p>
                {room.lastMessage && (
                  <p style={styles.messagePreview} className='text-cream-600'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {activeRooms.length === 0 && (
          <p style={styles.emptyState} className='text-cream-600'>
            {t('chat.noactive')}
          </p>
        )}
      </div>
    </div>
  )
}

export default ActiveChats
