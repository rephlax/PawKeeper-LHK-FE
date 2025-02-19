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

    newSocket.on('room_created', room => {
      console.log('Room created:', room)
    })

    newSocket.on('room_joined', room => {
      console.log('Joined room:', room)
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
        newSocket.off('room_created')
        newSocket.off('room_joined')
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

    return new Promise((resolve, reject) => {
      socket.emit(
        'create_room',
        {
          name: null,
          participants: [targetUserId],
          type: 'direct',
        },
        response => {
          if (!response?.roomId) {
            console.error('Failed to get room ID:', response)
            reject(new Error('Failed to create room'))
            return
          }

          const handleRoomJoined = room => {
            console.log('Joined room:', room)
            socket.off('room_joined', handleRoomJoined)
            resolve(room)
          }

          socket.on('room_joined', handleRoomJoined)

          socket.emit('join_room', response.roomId)
        },
      )
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
