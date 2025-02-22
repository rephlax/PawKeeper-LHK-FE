import { useRef, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useTranslation } from 'react-i18next'

const Messages = ({ roomId }) => {
  const messagesEndRef = useRef(null)
  const { socket, user } = useSocket()
  const { t } = useTranslation()
  const [messages, setMessages] = useState([])
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const userLanguage = 'en'

  // Fetch existing messages when room changes
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
          console.log('Fetched existing messages:', existingMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [roomId, BACKEND_URL])

  // Listen for new messages
  useEffect(() => {
    if (!socket || !roomId) return

    const handleReceiveMessage = message => {
      console.log('Received message:', message)
      setMessages(prev => [...prev, message])
    }

    const handleReceiveTranslation = ({ messageId, translatedText }) => {
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId
            ? { ...message, content: translatedText }
            : message,
        ),
      )
    }

    const handleTranslationFailure = ({ messageId }) => {
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId
            ? { ...message, translationFailed: true }
            : message,
        ),
      )
    }

    socket.on('receive_message', handleReceiveMessage)
    socket.on('receive_translation', handleReceiveTranslation)
    socket.on('receive_translation_failure', handleTranslationFailure)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
      socket.off('receive_translation', handleReceiveTranslation)
      socket.off('receive_translation_failure', handleTranslationFailure)
    }
  }, [socket, roomId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Request a translation for a message
  const requestTranslation = async messageId => {
    const targetLanguage = userLanguage
    socket.emit('request_translation', { messageId, targetLanguage })
  }

  // Container
  const containerStyle = {
    flex: '1',
    overflowY: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }

  // Message container
  const getMessageContainerStyle = isOwnMessage => ({
    display: 'flex',
    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
  })

  // Message bubble
  const getMessageBubbleStyle = () => ({
    maxWidth: '70%',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  })

  // Sender name
  const senderNameStyle = {
    fontSize: '0.75rem',
    opacity: '0.75',
    marginBottom: '0.25rem',
    fontWeight: '500',
  }

  // Message content
  const messageContentStyle = {
    fontSize: '0.875rem',
    wordBreak: 'break-word',
    lineHeight: '1.5',
  }

  // Message footer
  const messageFooterStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
  }

  // Timestamp
  const timestampStyle = {
    fontSize: '0.75rem',
    opacity: '0.75',
  }

  // Translate button
  const translateButtonStyle = {
    fontSize: '0.75rem',
    textDecoration: 'underline',
    opacity: '0.75',
    transition: 'opacity 0.2s',
  }

  // Translation error message
  const errorMessageStyle = {
    fontSize: '0.75rem',
    marginTop: '0.25rem',
  }

  return (
    <div style={containerStyle}>
      {messages.map(message => {
        const isOwnMessage = message.sender?._id === user?._id

        return (
          <div
            key={message._id || message.id}
            style={getMessageContainerStyle(isOwnMessage)}
          >
            <div
              style={getMessageBubbleStyle()}
              className={
                isOwnMessage
                  ? 'bg-cream-600 text-white'
                  : 'bg-cream-50 text-cream-800 border border-cream-200'
              }
            >
              <p style={senderNameStyle}>
                {message.sender?.username || 'Unknown'}
              </p>
              <p style={messageContentStyle}>{message.content}</p>
              <div style={messageFooterStyle}>
                <p style={timestampStyle}>
                  {new Date(
                    message.timeStamp || message.timestamp,
                  ).toLocaleTimeString()}
                </p>
                {/* {!isOwnMessage &&
                  !message.translationFailed && (
                    <button
                      onClick={() => requestTranslation(message.id)}
                      style={{
                        ...translateButtonStyle,
                        ':hover': { opacity: '1' }
                      }}
                      className="hover:opacity-100"
                    >
                      {t('chat.translate')}
                    </button>
                  )} */}
              </div>
              {/* {message.translationFailed && (
                <p 
                  style={errorMessageStyle}
                  className="text-red-500"
                >
                  {t('chat.translationFailed')}
                </p>
              )} */}
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default Messages
