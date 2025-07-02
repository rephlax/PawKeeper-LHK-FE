import React, { useState, useEffect } from 'react'
import { MessageSquare, X, Users, MessageCircle } from 'lucide-react'
import MessageInput from '../MessageInput'
import Messages from '../Messages'
import UserList from '../UserList'
import RoomList from '../RoomList'
import CreateRoomModal from '../CreateRoomModal'
import ChatInvitations from '../ChatInvitations'
import { useSocket } from '../../../context/SocketContext'
import { useChat } from '../../../context/ChatContext'
import { useTranslation } from 'react-i18next'
import { styles } from './chatwidget.styles'

const ChatWidget = () => {
  const { isOpen, setIsOpen } = useChat()
  const [activeRoom, setActiveRoom] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const [joinedRoomIds, setJoinedRoomIds] = useState(new Set())
  const { t } = useTranslation()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const { socket, user } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleRoomCreated = room => {
      console.log('Room created:', room)
      setActiveRoom(room)
      setIsOpen(true)
      setShowUserList(false)
      setJoinedRoomIds(prev => new Set([...prev, room._id]))
      socket.emit('join_room', room._id)
    }

    const handleRoomJoined = room => {
      console.log('Joined room:', room)
      if (room) {
        setActiveRoom(room)
        setIsOpen(true)
        setShowUserList(false)
        setJoinedRoomIds(prev => new Set([...prev, room._id]))
      }
    }

    const handleRoomInvitation = invitation => {
      console.log('Received room invitation:', invitation)
    }

    const handleError = error => {
      console.error('Socket error:', error)
    }

    const handleConnect = () => {
      setJoinedRoomIds(new Set())
    }

    socket.on('connect', handleConnect)
    socket.on('room_created', handleRoomCreated)
    socket.on('room_joined', handleRoomJoined)
    socket.on('room_invitation', handleRoomInvitation)
    socket.on('error', handleError)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('room_created', handleRoomCreated)
      socket.off('room_joined', handleRoomJoined)
      socket.off('room_invitation', handleRoomInvitation)
      socket.off('error', handleError)
    }
  }, [socket, setIsOpen])

  const handleCreateRoom = roomData => {
    if (isCreatingRoom) {
      console.log('Already creating a room, ignoring duplicate request')
      return
    }

    console.log('Attempting to create room:', roomData)
    if (socket) {
      setIsCreatingRoom(true)

      socket.emit('create_room', roomData, response => {
        setIsCreatingRoom(false)
        if (response?.error) {
          console.error('Room creation error:', response.error)
        } else {
          socket.emit('get_rooms')
          if (showUserList) {
            setShowUserList(false)
          }
        }
      })
    } else {
      console.error('Socket is not connected')
    }
  }

  const handleRoomSelect = roomId => {
    if (socket) {
      if (typeof roomId !== 'string' || roomId.length !== 24) {
        console.error('Invalid room ID:', roomId)
        alert('Invalid room ID. Please try again.')
        return
      }

      if (joinedRoomIds.has(roomId)) {
        console.log('Already tried to join this room, just setting as active')
        const room = activeRoom?._id === roomId ? activeRoom : null
        if (room) {
          setActiveRoom(room)
          setIsOpen(true)
          setShowUserList(false)
          return
        }
      }

      console.log('Attempting to join room:', roomId)
      setJoinedRoomIds(prev => new Set([...prev, roomId]))

      socket.emit('join_room', roomId, (room, error) => {
        if (error) {
          console.error('Room join error:', error)
          alert(error.error || 'Unable to join the room. Please try again.')
          return
        }

        if (room) {
          console.log('Successfully joined room:', room._id)
          setActiveRoom(room)
          setIsOpen(true)
          setShowUserList(false)
        } else {
          console.error('Failed to join room. No room data returned.')
          alert('Unable to join the room. Please try again.')
        }
      })
    } else {
      console.error('Socket is not connected')
      alert('Socket connection failed. Please reconnect.')
    }
  }

  const handleLeaveRoom = () => {
    if (socket && activeRoom) {
      socket.emit('leave_room', activeRoom._id)
      setJoinedRoomIds(prev => {
        const updated = new Set([...prev])
        updated.delete(activeRoom._id)
        return updated
      })
      setActiveRoom(null)
    }
  }

  const getRoomTitle = () => {
    if (!activeRoom?.participants) return t('chat.messenger')

    const otherParticipants = activeRoom.participants.filter(
      p => p._id !== user?._id,
    )

    if (otherParticipants.length === 0) return t('chat.messenger')

    if (activeRoom.type === 'group') {
      return `${t('chat.groupChat')} (${otherParticipants.length + 1} ${t('chat.members')})`
    }

    return otherParticipants[0].username
  }

  const handleButtonHover = e => {
    e.currentTarget.style.transform = 'scale(1.05)'
  }

  const handleButtonLeave = e => {
    e.currentTarget.style.transform = 'scale(1)'
  }

  return (
    <div style={styles.widget.container}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={styles.widget.button}
          className='bg-cream-600 text-white hover:bg-cream-700'
          onMouseOver={handleButtonHover}
          onMouseOut={handleButtonLeave}
        >
          <MessageSquare className='h-8 w-8' />
        </button>
      ) : (
        <div
          style={styles.window.container}
          className='bg-white border-cream-200'
        >
          <div
            style={styles.window.header}
            className='bg-white border-cream-200'
          >
            <h3 style={styles.window.headerTitle} className='text-cream-800'>
              {getRoomTitle()}
            </h3>
            <div style={styles.window.headerButtons}>
              {!activeRoom && (
                <button
                  onClick={() => setShowUserList(!showUserList)}
                  style={styles.iconButton}
                  className='text-cream-600 hover:bg-cream-50'
                  title={
                    showUserList ? t('chat.showChats') : t('chat.showUsers')
                  }
                >
                  {showUserList ? (
                    <MessageCircle className='h-5 w-5' />
                  ) : (
                    <Users className='h-5 w-5' />
                  )}
                </button>
              )}
              <button
                onClick={() => {
                  if (activeRoom) {
                    handleLeaveRoom()
                  } else {
                    setIsOpen(false)
                  }
                }}
                style={styles.iconButton}
                className='text-cream-600 hover:bg-cream-50'
                title={t('chat.close')}
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          <ChatInvitations onAccept={handleRoomSelect} />

          <div style={styles.content.area} className='bg-white'>
            {activeRoom ? (
              <div style={styles.content.activeChat}>
                <div style={styles.content.messagesContainer}>
                  <Messages roomId={activeRoom._id} />
                </div>
                <div
                  style={styles.content.inputContainer}
                  className='border-cream-200'
                >
                  <MessageInput roomId={activeRoom._id} />
                </div>
              </div>
            ) : showUserList ? (
              <UserList />
            ) : (
              <RoomList
                onRoomSelect={handleRoomSelect}
                activeRoomId={activeRoom?._id}
                onCreateRoom={() => setShowCreateRoom(true)}
              />
            )}
          </div>
        </div>
      )}

      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  )
}

export default ChatWidget
