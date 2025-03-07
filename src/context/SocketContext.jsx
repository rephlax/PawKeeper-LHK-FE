import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [nearbySitters, setNearbySitters] = useState([])
  const [isCreatingPrivateChat, setIsCreatingPrivateChat] = useState(false)
  const { isSignedIn, user } = useAuth()
  const authToken = localStorage.getItem('authToken')

  useEffect(() => {
    if (!isSignedIn || !authToken || !user) {
      setIsConnected(false)
      setOnlineUsers(new Set())
      setNearbySitters([])
      return
    }

    console.log(
      'Initiating socket connection to:',
      BACKEND_URL,
      'with user',
      user,
    )

    const newSocket = io(BACKEND_URL, {
      withCredentials: true,
      auth: {
        token: authToken,
        userId: user._id,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      secure: true,
    })

    newSocket.on('users_online', users => {
      console.log('Received online users:', users)
      setOnlineUsers(new Set(users))
    })

    newSocket.on('user_connected', userId => {
      console.log('User connected:', userId)
      setOnlineUsers(prev => new Set([...prev, userId]))
    })

    newSocket.on('user_disconnected', userId => {
      console.log('User disconnected:', userId)
      setOnlineUsers(prev => {
        const updated = new Set(prev)
        updated.delete(userId)
        return updated
      })
    })

    newSocket.on('connect_error', error => {
      console.log('Connection error details:', {
        message: error.message,
        description: error,
        url: BACKEND_URL,
        transport: error.transport,
        data: error.data,
      })
      setIsConnected(false)
    })

    newSocket.on('connect', () => {
      console.log('Socket connected!', newSocket.id)
      setIsConnected(true)
      newSocket.emit('get_online_users')
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
      setOnlineUsers(new Set())
    })

    newSocket.on('nearby_sitters', sitters => {
      console.log('Received nearby sitters:', sitters)
      setNearbySitters(sitters)
    })

    setSocket(newSocket)

    return () => {
      if (newSocket) {
        newSocket.off('connect')
        newSocket.off('disconnect')
        newSocket.off('connect_error')
        newSocket.off('users_online')
        newSocket.off('user_connected')
        newSocket.off('user_disconnected')
        newSocket.off('nearby_sitters')
        newSocket.close()
      }
    }
  }, [isSignedIn, authToken, user])

  const findNearbySitters = location => {
    if (socket) {
      socket.emit('search_nearby_sitters', location, response => {
        if (response?.sitters) {
          setNearbySitters(response.sitters)
        }
      })
    }
  }

  const startPrivateChat = async targetUserId => {
    if (!socket) return

    // Prevent duplicate chat creation attempts
    if (isCreatingPrivateChat) {
      console.log('Already creating a private chat, ignoring duplicate request')
      return Promise.reject(new Error('Chat creation in progress'))
    }

    setIsCreatingPrivateChat(true)

    return new Promise((resolve, reject) => {
      // First, check if a direct chat with this user already exists
      socket.emit('get_rooms')

      const handleRoomsList = roomsList => {
        // Look for an existing direct chat with the target user
        const existingRoom = roomsList.find(
          room =>
            room.type === 'direct' &&
            room.participants.some(p => p._id === targetUserId),
        )

        if (existingRoom) {
          console.log('Found existing direct chat, reusing:', existingRoom._id)
          socket.off('rooms_list', handleRoomsList)
          setIsCreatingPrivateChat(false) // Reset flag

          // Join the existing room
          socket.emit('join_room', existingRoom._id, (room, error) => {
            if (error) {
              reject(new Error(error.error || 'Failed to join existing room'))
              return
            }
            resolve(room)
          })
          return
        }

        // No existing room found, create a new one
        socket.off('rooms_list', handleRoomsList)

        socket.emit(
          'create_room',
          {
            name: 'Direct Chat',
            participants: [targetUserId],
            type: 'direct',
          },
          async response => {
            setIsCreatingPrivateChat(false) // Reset flag
            if (!response?.roomId) {
              console.error('Failed to get room ID:', response)
              reject(new Error('Failed to create room'))
              return
            }

            // Join the new room
            socket.emit('join_room', response.roomId, (room, error) => {
              if (error) {
                reject(new Error(error.error || 'Failed to join room'))
                return
              }
              resolve(room)
            })
          },
        )
      }

      // Listen for rooms list
      socket.on('rooms_list', handleRoomsList)
    }).catch(error => {
      setIsCreatingPrivateChat(false) // Reset flag on error
      throw error
    })
  }

  const contextValue = {
    socket,
    user,
    isConnected,
    onlineUsers,
    nearbySitters,
    findNearbySitters,
    isUserOnline: userId => onlineUsers.has(userId),
    startPrivateChat,
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
