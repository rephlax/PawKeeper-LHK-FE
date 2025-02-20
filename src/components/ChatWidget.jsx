import React, { useState, useEffect } from 'react'
import { MessageSquare, X, Users, MessageCircle } from 'lucide-react'
import MessageInput from './MessageInput'
import Messages from './Messages'
import UserList from './UserList'
import RoomList from './RoomList'
import CreateRoomModal from './CreateRoomModal'
import ChatInvitations from './ChatInvitations'
import { useSocket } from '../context/SocketContext'
import { useChat } from '../context/ChatContext'

const ChatWidget = () => {
  const { isOpen, setIsOpen } = useChat()
  const [activeRoom, setActiveRoom] = useState(null)
  const [showUserList, setShowUserList] = useState(false)
  const [showCreateRoom, setShowCreateRoom] = useState(false)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    const handleRoomCreated = room => {
      console.log('Room created:', room)
      setActiveRoom(room._id)
      setIsOpen(true)
      setShowUserList(false)
      // Trigger immediate message fetch
      socket.emit('join_room', room._id)
    }

    const handleRoomJoined = room => {
      console.log('Joined room:', room)
      if (room) {
        setActiveRoom(room._id)
        setIsOpen(true)
        setShowUserList(false)
      }
    }

    const handleRoomInvitation = invitation => {
      console.log('Received room invitation:', invitation)
    }

    const handleError = error => {
      console.error('Socket error:', error)
    }

    socket.on('room_created', handleRoomCreated)
    socket.on('room_joined', handleRoomJoined)
    socket.on('room_invitation', handleRoomInvitation)
    socket.on('error', handleError)

    return () => {
      socket.off('room_created', handleRoomCreated)
      socket.off('room_joined', handleRoomJoined)
      socket.off('room_invitation', handleRoomInvitation)
      socket.off('error', handleError)
    }
  }, [socket])

  const handleCreateRoom = roomData => {
    console.log('Attempting to create room:', roomData)
    if (socket) {
      socket.emit('create_room', roomData, response => {
        if (response?.error) {
          console.error('Room creation error:', response.error)
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
        return
      }

      socket.emit('join_room', roomId)
      setActiveRoom(roomId)
    }
  }

  const handleLeaveRoom = () => {
    if (socket && activeRoom) {
      socket.emit('leave_room', activeRoom)
      setActiveRoom(null)
    }
  }

  return (
    <div
      className='fixed bottom-14 right-4 z-50'
      style={{ maxHeight: '600px' }}
    >
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className='cursor-pointer bg-cream-background text-cream-text p-4 rounded-full hover:bg-cream-surface shadow-lg w-15 h-15 flex items-center justify-center'
        >
          <MessageSquare className='h-10 w-10' />
        </button>
      ) : (
        <div
          className='bg-cream-background rounded-lg shadow-xl flex flex-col border-2 border-cream-accent/50 p-4'
          style={{ width: '320px', height: '480px' }}
        >
          <div className='bg-cream-background text-cream-text flex justify-between items-center rounded-t-lg'>
            <h3
              className='font-medium text-lg cursor-default'
              style={{ paddingLeft: '6px' }}
            >
              {activeRoom ? 'Messager' : 'Messager'}
            </h3>
            <div className='flex gap-2'>
              {!activeRoom && (
                <>
                  <button
                    onClick={() => setShowUserList(!showUserList)}
                    className='cursor-pointer hover:bg-cream-surface p-1 rounded'
                    title={showUserList ? 'Show Chats' : 'Show Users'}
                  >
                    {showUserList ? (
                      <MessageCircle className='h-5 w-5' />
                    ) : (
                      <Users className='h-5 w-5' />
                    )}
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  if (activeRoom) {
                    handleLeaveRoom()
                  } else {
                    setIsOpen(false)
                  }
                }}
                className='cursor-pointer hover:bg-cream-surface p-1 rounded'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          <ChatInvitations onAccept={handleRoomSelect} />

          <div className='flex-1 overflow-hidden'>
            {activeRoom ? (
              <div className='flex flex-col h-full'>
                <div className='flex-1 overflow-hidden'>
                  <Messages roomId={activeRoom} />
                </div>
                <div className='p-4 border-t'>
                  <MessageInput roomId={activeRoom} />
                </div>
              </div>
            ) : showUserList ? (
              <UserList />
            ) : (
              <RoomList
                onRoomSelect={handleRoomSelect}
                activeRoomId={activeRoom}
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
