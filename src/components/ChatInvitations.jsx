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
    <div className='p-2'>
      {invitations.map((invitation, index) => (
        <div
          key={index}
          className='border p-2 rounded mb-2 flex justify-between items-center bg-blue-50'
        >
          <span className='text-sm'>
            {t('chat.invite')} {invitation.invitedBy}
          </span>
          <button
            onClick={() => acceptInvitation(invitation)}
            className='px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600'
          >
            {t('chat.accept')}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ChatInvitations
