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

  const startPrivateChat = userId => {
    console.log('Starting private chat with:', userId)
    socket.emit('start_private_chat', { targetUserId: userId })
  }

  return (
    <div className='p-4'>
      <h3 className='font-medium text-cream-800 mb-4'>
        {t('userlist.available')}
      </h3>
      <div className='space-y-2'>
        {users.map(user => (
          <div
            key={user._id}
            className='flex justify-between items-center p-3 rounded-lg border border-cream-200
                     hover:bg-cream-50 transition-colors duration-200'
          >
            <div className='flex items-center gap-3'>
              <div className='relative'>
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className='w-10 h-10 rounded-full object-cover border-2 border-cream-200'
                  />
                ) : (
                  <div
                    className='w-10 h-10 rounded-full bg-cream-100 border-2 border-cream-200
                               flex items-center justify-center text-cream-600 font-medium'
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${isUserOnline(user._id) ? 'bg-green-500' : 'bg-cream-400'}`}
                />
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  <p className='font-medium text-cream-800'>{user.username}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full
                    ${
                      isUserOnline(user._id)
                        ? 'bg-green-100 text-green-700'
                        : 'bg-cream-100 text-cream-600'
                    }`}
                  >
                    {isUserOnline(user._id)
                      ? t('userlist.online')
                      : t('userlist.offline')}
                  </span>
                </div>
                {user.sitter && (
                  <p className='text-xs text-cream-600'>
                    {t('userlist.petsitter')}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => startPrivateChat(user._id)}
              disabled={!isUserOnline(user._id)}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors duration-200
                ${
                  isUserOnline(user._id)
                    ? 'bg-cream-600 text-white hover:bg-cream-700'
                    : 'bg-cream-100 text-cream-400 cursor-not-allowed'
                }`}
            >
              {t('userlist.chat')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserList
