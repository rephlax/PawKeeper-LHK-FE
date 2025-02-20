import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { useTranslation } from 'react-i18next'

const ChatInvitations = () => {
  const { t } = useTranslation()
  const [invitations, setInvitations] = useState([])
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on('chat_invitation', invitation => {
      console.log('Received invitation:', invitation)
      setInvitations(prev => [...prev, invitation])
    })

    return () => {
      socket?.off('chat_invitation')
    }
  }, [socket])

  const acceptInvitation = invitation => {
    if (!socket) return

    try {
      const roomId = invitation.roomId

      if (typeof roomId !== 'string' || roomId.length !== 24) {
        console.error('Invalid room ID:', roomId)
        return
      }

      socket.emit('join_room', roomId)
      setInvitations(prev => prev.filter(inv => inv.roomId !== roomId))
    } catch (error) {
      console.error('Error accepting invitation:', error)
    }
  }

  if (invitations.length === 0) return null

  return (
    <div className='px-4 py-2 space-y-2'>
      {invitations.map((invitation, index) => (
        <div
          key={index}
          className='flex justify-between items-center p-3 rounded-lg
                   bg-cream-50 border border-cream-200'
        >
          <span className='text-sm text-cream-800'>
            <span className='font-medium'>{invitation.invitedBy}</span>{' '}
            {t('chat.invite')}
          </span>
          <button
            onClick={() => acceptInvitation(invitation)}
            className='px-4 py-1.5 bg-cream-600 text-white text-sm rounded-md
                     hover:bg-cream-700 transition-colors duration-200'
          >
            {t('chat.accept')}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ChatInvitations
