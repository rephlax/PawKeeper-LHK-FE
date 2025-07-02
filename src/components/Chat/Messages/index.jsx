import { useRef, useEffect, useState } from 'react'
import { useSocket } from '../../../context/SocketContext'
import { useTranslation } from 'react-i18next'
import { styles } from './Messages.styles'

const Messages = ({ roomId }) => {
  const messagesEndRef = useRef(null)
  const { socket, user } = useSocket()
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!roomId) return

    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/messages/chat/${roomId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })

        if (response.ok) {
          const existingMessages = await response.json()
          setMessages(existingMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [roomId, BACKEND_URL])

  useEffect(() => {
    if (!socket || !roomId) return

    const handleReceiveMessage = message => {
      setMessages(prev => [...prev, message])
    }

    socket.on('receive_message', handleReceiveMessage)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [socket, roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div style={styles.container}>
      {messages.map(message => {
        const isOwnMessage = message.sender?._id === user?._id

        return (
          <div
            key={message._id || message.id}
            style={styles.message.container(isOwnMessage)}
          >
            <div
              style={styles.message.bubble}
              className={
                isOwnMessage
                  ? 'bg-cream-600 text-white'
                  : 'bg-cream-50 text-cream-800 border border-cream-200'
              }
            >
              <p style={styles.message.senderName}>
                {message.sender?.username || 'Unknown'}
              </p>
              <p style={styles.message.content}>{message.content}</p>
              <div style={styles.message.footer}>
                <p style={styles.message.timestamp}>
                  {new Date(
                    message.timeStamp || message.timestamp,
                  ).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Messages
