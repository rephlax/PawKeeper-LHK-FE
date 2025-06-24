import { useState, useEffect } from 'react'
import { useSocket } from '../../../context/SocketContext'
import { useTranslation } from 'react-i18next'
import { styles } from './ChatInvitations.styles'

const ChatInvitations = ({ onAccept }) => {
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

      if (onAccept) {
        onAccept(roomId)
      }
    } catch (error) {
      console.error('Error accepting invitation:', error)
    }
  }

  if (invitations.length === 0) return null

  return (
    <div style={styles.container}>
      {invitations.map((invitation, index) => (
        <div
          key={index}
          style={styles.invitationItem}
          className='bg-cream-50 border-cream-200'
        >
          <span style={styles.invitationText} className='text-cream-800'>
            <span style={styles.username}>{invitation.invitedBy}</span>{' '}
            {t('chat.invite')}
          </span>
          <button
            onClick={() => acceptInvitation(invitation)}
            style={styles.acceptButton}
            className='bg-cream-600 text-white hover:bg-cream-700'
          >
            {t('chat.accept')}
          </button>
        </div>
      ))}
    </div>
  )
}

export default ChatInvitations
