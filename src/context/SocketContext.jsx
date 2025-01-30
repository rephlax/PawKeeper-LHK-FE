import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
const SocketContext = createContext(null)

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null)
    const [username, setUsername] = useState(() => 
        `User_${Math.floor(Math.random() * 1000)}`
    )

    useEffect(() => {
        console.log("Initiating socket connection to:", BACKEND_URL);
        
        const newSocket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected!', newSocket.id);
            // Register temporary username
            newSocket.emit('register_user', username);
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
    }, [username])

    return (
        <SocketContext.Provider value={{ socket, username }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)