import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const { isAuthenticated, user, authToken } = useAuth()

    useEffect(() => {
        // Only connect if user is authenticated
        if (!isAuthenticated || !authToken) return;

        console.log("Initiating socket connection to:", BACKEND_URL);
        
        const newSocket = io(BACKEND_URL, {
            auth: {
                token: authToken
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected!', newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.log('Connection error details:', {
                message: error.message,
                description: error,
            });
        });

        setSocket(newSocket);
    
        return () => {
            if (newSocket) newSocket.close();
        }
    }, [isAuthenticated, authToken]) // Reconnect if auth state changes

    return (
        <SocketContext.Provider value={{ socket, user }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)