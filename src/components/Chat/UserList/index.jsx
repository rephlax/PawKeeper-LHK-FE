import { useState, useEffect } from 'react'
import { useSocket } from '../../../context/SocketContext'
import { useTranslation } from 'react-i18next'
import { useChat } from '../../../context/ChatContext'
import { styles } from './UserList.styles'

const UserList = () => {
  const { t } = useTranslation()
  const [users, setUsers] = useState([])
  const { socket, isUserOnline, user } = useSocket()
  const { isOpen, setIsOpen } = useChat()
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
  }, [socket, user?._id, BACKEND_URL])

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

  return (
    <div style={styles.container}>
      <h3 style={styles.header} className='text-cream-800'>
        {t('userlist.available')}
      </h3>
      <div
        style={styles.userList}
        className='scrollbar-thin scrollbar-thumb-cream-300 scrollbar-track-cream-50'
      >
        {users.map(userItem => {
          const isOnline = isUserOnline(userItem._id)

          return (
            <div
              key={userItem._id}
              style={styles.userItem}
              className='border-cream-200 hover:bg-cream-50'
            >
              <div style={styles.userInfo}>
                <div style={styles.avatarContainer}>
                  {userItem.profilePicture ? (
                    <img
                      src={userItem.profilePicture}
                      alt={userItem.username}
                      style={styles.avatarImage}
                      className='border-cream-200'
                    />
                  ) : (
                    <div
                      style={styles.avatarPlaceholder}
                      className='bg-cream-100 border-cream-200 text-cream-600'
                    >
                      {userItem.username[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    style={styles.statusIndicator}
                    className={isOnline ? 'bg-green-500' : 'bg-cream-400'}
                  />
                </div>
                <div style={styles.userDetails}>
                  <div style={styles.usernameContainer}>
                    <p style={styles.username} className='text-cream-800'>
                      {userItem.username}
                    </p>
                    <span
                      style={styles.statusBadge(isOnline)}
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
                    <p style={styles.userRole} className='text-cream-600'>
                      {t('userlist.petsitter')}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => startPrivateChat(userItem._id)}
                disabled={!isOnline}
                style={styles.chatButton(isOnline)}
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
