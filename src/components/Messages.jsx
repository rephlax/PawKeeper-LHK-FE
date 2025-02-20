import { useRef, useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Messages = ({ roomId }) => {
  const messagesEndRef = useRef(null);
  const { socket, user } = useSocket();
  const [messages, setMessages] = useState([]);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const userLanguage = 'en'; // Specify the user's language code

  // Fetch existing messages when room changes
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/messages/chat/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const existingMessages = await response.json();
          setMessages(existingMessages);
          console.log('Fetched existing messages:', existingMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomId, BACKEND_URL]);

  // Listen for new messages
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleReceiveMessage = message => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    };

    const handleReceiveTranslation = ({ messageId, translatedText }) => {
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId ? { ...message, content: translatedText } : message
        )
      );
    };

    const handleTranslationFailure = ({ messageId }) => {
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId ? { ...message, translationFailed: true } : message
        )
      );
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('receive_translation', handleReceiveTranslation);
    socket.on('receive_translation_failure', handleTranslationFailure);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('receive_translation', handleReceiveTranslation);
      socket.off('receive_translation_failure', handleTranslationFailure);
    };
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Request a translation for a message
  const requestTranslation = async (messageId) => {
    const targetLanguage = userLanguage; // Specify what the user's language is
    socket.emit('request_translation', { messageId, targetLanguage });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(message => (
        <div
          key={message._id || message.id}
          className={`flex ${message.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.sender?._id === user?._id
                ? 'bg-cream-500 text-white'
                : 'bg-cream-100 text-gray-900'
            }`}
          >
            <p className="text-xs opacity-75">{message.sender?.username || 'Unknown Sender'}</p>
            <p className="text-sm break-words">{message.content}</p>
            <p className="text-xs opacity-75">
              {new Date(message.timeStamp || message.timestamp).toLocaleTimeString()}
            </p>
            {message.sender?._id !== user?._id && !message.translationFailed && (
              <button
                className="testtest"
                onClick={() => requestTranslation(message.id)}
              >
                Translate
              </button>
            )}
            {message.translationFailed && (

              <p className="text-xs text-red-500">Translation failed, try again</p>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
