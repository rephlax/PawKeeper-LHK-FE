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
          className='p-3 bg-cream-600 text-white rounded-full shadow-lg hover:bg-cream-700
                   transform hover:scale-105 transition-all duration-200 
                   flex items-center justify-center'
        >
          <MessageSquare className='h-6 w-6' />
        </button>
      ) : (
        <div
          className='bg-white rounded-xl shadow-xl flex flex-col border border-cream-200
                   overflow-hidden'
          style={{ width: '320px', height: '480px' }}
        >
          {/* Header */}
          <div className='px-4 py-3 bg-white border-b border-cream-200 flex justify-between items-center'>
            <h3 className='font-medium text-cream-800'>
              {activeRoom ? 'Messager' : 'Messager'}
            </h3>
            <div className='flex gap-2'>
              {!activeRoom && (
                <>
                  <button
                    onClick={() => setShowUserList(!showUserList)}
                    className='p-1.5 text-cream-600 hover:bg-cream-50 rounded-md
                             transition-colors duration-200'
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
                className='p-1.5 text-cream-600 hover:bg-cream-50 rounded-md
                         transition-colors duration-200'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>

          {/* Chat Invitations Section */}
          <ChatInvitations onAccept={handleRoomSelect} />

          {/* Main Content Area */}
          <div className='flex-1 overflow-hidden bg-white'>
            {activeRoom ? (
              <div className='flex flex-col h-full'>
                <div className='flex-1 overflow-hidden'>
                  <Messages roomId={activeRoom} />
                </div>
                <div className='border-t border-cream-200'>
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
