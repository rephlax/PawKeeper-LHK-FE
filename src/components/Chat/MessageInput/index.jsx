import { useState } from 'react'
import { useSocket } from '../../../context/SocketContext'
import { useTranslation } from 'react-i18next'
import { styles } from './MessageInput.styles'

const MessageInput = ({ roomId }) => {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const { socket } = useSocket()

  const handleSubmit = e => {
    e.preventDefault()
    if (!message.trim() || !socket || !roomId) return
    const messageContent = message.trim()
    setMessage('')

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

  return (
    <form
      onSubmit={handleSubmit}
      style={styles.form}
      className='border-cream-200'
    >
      <input
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t('chat.typeMessage')}
        style={styles.input}
        className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent placeholder:text-cream-400'
      />
      <button
        type='submit'
        disabled={!message.trim() || !socket}
        style={styles.button}
        className='bg-cream-600 text-white hover:bg-cream-700 disabled:bg-cream-400 disabled:cursor-not-allowed'
      >
        {t('chat.send')}
      </button>
    </form>
  )
}

export default MessageInput
