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

  // Container
  const containerStyle = {
    padding: '1rem',
  }

  // Heading
  const headingStyle = {
    fontWeight: '500',
    marginBottom: '1rem',
  }

  // List container
  const listContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // Chat item
  const chatItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  }

  // User info container
  const userInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }

  // Avatar container
  const avatarContainerStyle = {
    position: 'relative',
  }

  // Avatar image
  const avatarImageStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    objectFit: 'cover',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  // Status indicator
  const statusIndicatorStyle = {
    position: 'absolute',
    bottom: '0',
    right: '0',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '9999px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'white',
  }

  // Text container
  const textContainerStyle = {
    minWidth: '0',
    flexGrow: '1',
  }

  // Username
  const usernameStyle = {
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  // Message preview
  const messagePreviewStyle = {
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  // Empty state
  const emptyStateStyle = {
    textAlign: 'center',
    fontSize: '0.875rem',
    padding: '1rem 0',
  }

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle} className='text-cream-800'>
        {t('chat.active')}
      </h3>
      <div style={listContainerStyle}>
        {activeRooms.map(room => (
          <div
            key={room._id}
            onClick={() => handleChatClick(room._id)}
            style={chatItemStyle}
            className='border-cream-200 hover:bg-cream-50'
          >
            <div style={userInfoStyle}>
              {room.participants.map(participant => {
                if (participant._id !== socket?.user?._id) {
                  return (
                    <div key={participant._id} style={avatarContainerStyle}>
                      <img
                        src={participant.profilePicture || defaultUser}
                        alt={participant.username}
                        style={avatarImageStyle}
                        className='border-cream-200'
                      />
                      <div
                        style={statusIndicatorStyle}
                        className={
                          room.isActive ? 'bg-green-500' : 'bg-cream-400'
                        }
                      />
                    </div>
                  )
                }
                return null
              })}
              <div style={textContainerStyle}>
                <p style={usernameStyle} className='text-cream-800'>
                  {room.participants
                    .filter(p => p._id !== socket?.user?._id)
                    .map(p => p.username)
                    .join(', ')}
                </p>
                {room.lastMessage && (
                  <p style={messagePreviewStyle} className='text-cream-600'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {activeRooms.length === 0 && (
          <p style={emptyStateStyle} className='text-cream-600'>
            {t('chat.noactive')}
          </p>
        )}
      </div>
    </div>
  )
}

export default ActiveChats
