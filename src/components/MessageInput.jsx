import { useState } from 'react'
import { useSocket } from '../context/SocketContext'
import { useTranslation } from 'react-i18next'

const MessageInput = ({ roomId }) => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const { socket } = useSocket()

  const handleSubmit = e => {
    e.preventDefault()
    if (!message.trim() || !socket || !roomId) return
    const messageContent = message.trim()
    setMessage('')

    console.log('Sending message to room:', roomId)
    socket.emit(
      'send_message',
      {
        roomId,
        content: messageContent,
      },
      error => {
        if (error) {
          console.error('Error sending message:', error)
          setMessage(messageContent)
          return
        }
      },
    )
  }

  // Form
  const formStyle = {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // Input
  const inputStyle = {
    flex: '1',
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '0.875rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
  }

  // Button
  const buttonStyle = {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={formStyle}
      className='border-cream-200'
    >
      <input
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t('chat.typeMessage')}
        style={inputStyle}
        className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent placeholder:text-cream-400'
      />
      <button
        type='submit'
        disabled={!message.trim() || !socket}
        style={buttonStyle}
        className='bg-cream-600 text-white hover:bg-cream-700 disabled:bg-cream-400 disabled:cursor-not-allowed'
      >
        {t('chat.send')}
      </button>
    </form>
  )
}

export default MessageInput
