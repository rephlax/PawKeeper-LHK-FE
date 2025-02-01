import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false) 
    const { isSignedIn, user } = useAuth()
    const authToken = localStorage.getItem("authToken")

    useEffect(() => {
        if (!isSignedIn || !authToken) {
            setIsConnected(false)
            return
        }

        console.log("Initiating socket connection to:", BACKEND_URL)
        
        const newSocket = io(BACKEND_URL, {
            auth: {
                token: authToken
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000 // 10 second timeout
        })

        // Connection event handlers
        newSocket.on('connect', () => {
            console.log('Socket connected!', newSocket.id)
            setIsConnected(true)
        })

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected')
            setIsConnected(false)
        })

        newSocket.on('connect_error', (error) => {
            console.log('Connection error:', {
                message: error.message,
                description: error,
            })
            setIsConnected(false)
        })

        setSocket(newSocket)
    
        return () => {
            if (newSocket) {
                newSocket.off('connect')
                newSocket.off('disconnect')
                newSocket.off('connect_error')
                newSocket.close()
            }
        }
    }, [isSignedIn, authToken])

    const contextValue = {
        socket,
        user,
        isConnected,
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