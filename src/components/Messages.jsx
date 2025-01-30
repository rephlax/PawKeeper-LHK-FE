import { useRef, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'

const Messages = () => {
    const messagesEndRef = useRef(null)
    const { socket, username } = useSocket()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (socket) {
            socket.on('receive_message', (message) => {
                setMessages(prev => [...prev, message])
            });
        }

        return () => {
            if (socket) {
                socket.off('receive_message')
            }
        }
    }, [socket])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.sender === username 
                            ? 'justify-end' 
                            : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === username
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-900'
                        }`}
                    >
                        <p className="text-xs opacity-75">{message.sender}</p>
                        <p className="text-sm break-words">{message.text}</p>
                        <p className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages