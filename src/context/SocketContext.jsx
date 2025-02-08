import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState(new Set())
    const { isSignedIn, user } = useAuth()
    const authToken = localStorage.getItem("authToken")

    useEffect(() => {
        if (!isSignedIn || !authToken || !user) {
            setIsConnected(false)
            setOnlineUsers(new Set())
            return
        }

        console.log("Initiating socket connection to:", BACKEND_URL, "with user", user)
        
        const newSocket = io(BACKEND_URL, {
            auth: {
                token: authToken,
                userId: user._id
            },
            path: '/socket.io',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000,
            secure: true,
            rejectUnauthorized: false
        })

        newSocket.on('users_online', (users) => {
            console.log('Received online users:', users)
            setOnlineUsers(new Set(users))
        })

        newSocket.on('user_connected', (userId) => {
            console.log('User connected:', userId)
            setOnlineUsers(prev => new Set([...prev, userId]))
        })

        newSocket.on('user_disconnected', (userId) => {
            console.log('User disconnected:', userId)
            setOnlineUsers(prev => {
                const updated = new Set(prev)
                updated.delete(userId)
                return updated
            })
        })

        newSocket.on('connect_error', (error) => {
            console.log('Connection error details:', {
                message: error.message,
                description: error,
                url: BACKEND_URL,
                transport: error.transport,
                data: error.data
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

        setSocket(newSocket)
    
        return () => {
            if (newSocket) {
                newSocket.off('connect')
                newSocket.off('disconnect')
                newSocket.off('connect_error')
                newSocket.off('users_online')
                newSocket.off('user_connected')
                newSocket.off('user_disconnected')
                newSocket.close()
            }
        }
    }, [isSignedIn, authToken, user])

    const contextValue = {
        socket,
        user,
        isConnected,
        onlineUsers,
        isUserOnline: (userId) => onlineUsers.has(userId)
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