import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useTranslation } from 'react-i18next'

const UserList = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const { socket, isUserOnline, user } = useSocket()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!socket) return

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data.filter(u => u._id !== user?._id))
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()

    const events = ['users_online', 'user_connected', 'user_disconnected']
    events.forEach(event => {
      socket.on(event, fetchUsers)
    })

    socket.emit('get_online_users')

    return () => {
      events.forEach(event => {
        socket.off(event)
      })
    }
  }, [socket, user?._id])

  const startPrivateChat = async userId => {
    try {
      if (!isOpen) {
        setIsOpen(true)
      }
      const room = await socket.emit(
        'create_room',
        {
          name: null,
          participants: [userId],
          type: 'direct',
        },
        response => {
          if (response?.error) {
            console.error('Room creation error:', response.error)
          }
        },
      )
      if (room) {
        socket.emit('join_room', room._id)
        socket.emit('get_rooms')
      }
    } catch (error) {
      console.error('Error starting chat:', error)
    }
  }

  // Container
  const containerStyle = {
    padding: '1rem',
  }

  // Header
  const headerStyle = {
    fontWeight: '500',
    marginBottom: '1rem',
  }

  // User list container
  const userListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // User item
  const userItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    transition: 'background-color 0.2s',
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

  // Avatar placeholder
  const avatarPlaceholderStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  // Online status indicator
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

  // User details container
  const userDetailsStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  // Username container
  const usernameContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  // Username
  const usernameStyle = {
    fontWeight: '500',
  }

  // Status badge
  const getStatusBadgeStyle = isOnline => ({
    fontSize: '0.75rem',
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '0.125rem',
    paddingBottom: '0.125rem',
    borderRadius: '9999px',
  })

  // User role
  const userRoleStyle = {
    fontSize: '0.75rem',
  }

  // Chat button
  const getChatButtonStyle = isOnline => ({
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.375rem',
    paddingBottom: '0.375rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
    cursor: isOnline ? 'pointer' : 'not-allowed',
  })

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle} className='text-cream-800'>
        {t('userlist.available')}
      </h3>
      <div style={userListStyle}>
        {users.map(userItem => {
          const isOnline = isUserOnline(userItem._id)

          return (
            <div
              key={userItem._id}
              style={userItemStyle}
              className='border-cream-200 hover:bg-cream-50'
            >
              <div style={userInfoStyle}>
                <div style={avatarContainerStyle}>
                  {userItem.profilePicture ? (
                    <img
                      src={userItem.profilePicture}
                      alt={userItem.username}
                      style={avatarImageStyle}
                      className='border-cream-200'
                    />
                  ) : (
                    <div
                      style={avatarPlaceholderStyle}
                      className='bg-cream-100 border-cream-200 text-cream-600'
                    >
                      {userItem.username[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    style={statusIndicatorStyle}
                    className={isOnline ? 'bg-green-500' : 'bg-cream-400'}
                  />
                </div>
                <div style={userDetailsStyle}>
                  <div style={usernameContainerStyle}>
                    <p style={usernameStyle} className='text-cream-800'>
                      {userItem.username}
                    </p>
                    <span
                      style={getStatusBadgeStyle(isOnline)}
                      className={
                        isOnline
                          ? 'bg-green-100 text-green-700'
                          : 'bg-cream-100 text-cream-600'
                      }
                    >
                      {isOnline ? t('userlist.online') : t('userlist.offline')}
                    </span>
                  </div>
                  {userItem.sitter && (
                    <p style={userRoleStyle} className='text-cream-600'>
                      {t('userlist.petsitter')}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => startPrivateChat(userItem._id)}
                disabled={!isOnline}
                style={getChatButtonStyle(isOnline)}
                className={
                  isOnline
                    ? 'bg-cream-600 text-white hover:bg-cream-700'
                    : 'bg-cream-100 text-cream-400'
                }
              >
                {t('userlist.chat')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default UserList
