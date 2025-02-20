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

  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-2 p-4 border-t border-cream-200'
    >
      <input
        type='text'
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder={t('chat.typeMessage')}
        className='flex-1 px-3 py-2 text-sm border border-cream-300 rounded-md
                 focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                 transition duration-200 placeholder:text-cream-400'
      />
      <button
        type='submit'
        disabled={!message.trim() || !socket}
        className='px-4 py-2 text-sm bg-cream-600 text-white rounded-md 
                 hover:bg-cream-700 transition-colors duration-200
                 disabled:bg-cream-400 disabled:cursor-not-allowed'
      >
        {t('chat.send')}
      </button>
    </form>
  )
}

export default MessageInput
