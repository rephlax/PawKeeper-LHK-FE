import { useRef, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'

const Messages = ({ roomId }) => {
    const messagesEndRef = useRef(null)
    const { socket, user } = useSocket()
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (!socket || !roomId) return;

        setMessages([]);

        console.log('Listening for messages in room:', roomId);

        socket.on('receive_message', (message) => {
            console.log('Received message:', message);
            setMessages(prev => [...prev, message]);
        });

        return () => {
            socket?.off('receive_message');
        }
    }, [socket, roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`flex ${
                        message.sender._id === user?._id 
                            ? 'justify-end' 
                            : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender._id === user?._id
                                ? 'bg-cream-500 text-white'
                                : 'bg-cream-100 text-gray-900'
                        }`}
                    >
                        <p className="text-xs opacity-75">{message.sender.username}</p>
                        <p className="text-sm break-words">{message.content}</p>
                        <p className="text-xs opacity-75">
                            {new Date(message.timeStamp).toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default Messages;