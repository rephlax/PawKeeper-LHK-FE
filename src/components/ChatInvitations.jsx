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

  // Container
  const containerStyle = {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // Invitation item
  const invitationItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Invitation text
  const invitationTextStyle = {
    fontSize: '0.875rem',
  }

  // Username
  const usernameStyle = {
    fontWeight: '500',
  }

  // Accept button
  const acceptButtonStyle = {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.375rem',
    paddingBottom: '0.375rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  if (invitations.length === 0) return null

  return (
    <div style={containerStyle}>
      {invitations.map((invitation, index) => (
        <div
          key={index}
          style={invitationItemStyle}
          className='bg-cream-50 border-cream-200'
        >
          <span style={invitationTextStyle} className='text-cream-800'>
            <span style={usernameStyle}>{invitation.invitedBy}</span>{' '}
            {t('chat.invite')}
          </span>
          <button
            onClick={() => acceptInvitation(invitation)}
            style={acceptButtonStyle}
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
