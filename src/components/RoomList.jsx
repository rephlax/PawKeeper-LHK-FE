import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { Plus, Hash, MessageCircle, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const RoomList = ({ onRoomSelect, activeRoomId, onCreateRoom }) => {
  const [rooms, setRooms] = useState([])
  const { socket, user } = useSocket()
  const { t } = useTranslation()

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available')
      return
    }

    console.log('Socket is connected:', socket.connected)

    socket.emit('get_rooms')

    socket.on('rooms_list', roomsList => {
      setRooms(roomsList)
    })

    socket.on('room_created', newRoom => {
      setRooms(prev => [...prev, newRoom])
    })

    socket.on('room_joined', room => {
      setRooms(prev => {
        if (!prev.find(r => r._id === room._id)) {
          return [...prev, room]
        }
        return prev
      })
    })

    socket.on('room_deleted', roomId => {
      console.log('Room deleted event received for roomId:', roomId)
      setRooms(prev => prev.filter(room => room._id !== roomId))
    })

    socket.on('error', error => {
      console.error('Socket error:', error)
      alert(`Error: ${error.message || 'Unknown error'}`)
    })

    return () => {
      socket.off('rooms_list')
      socket.off('room_created')
      socket.off('room_joined')
      socket.off('room_deleted')
      socket.off('error')
    }
  }, [socket])

  const handleDeleteRoom = (e, roomId) => {
    e.stopPropagation()

    if (!roomId) {
      console.error('No room ID provided')
      return
    }

    const roomToDelete = rooms.find(room => room._id === roomId)

    if (!roomToDelete) {
      console.error('Room not found in state')
      return
    }

    console.log('Room creator ID:', roomToDelete.creator)
    console.log('Current user ID:', user?._id)

    if (roomToDelete.creator.toString() !== user?._id) {
      alert('You are not authorized to delete this room')
      return
    }

    if (window.confirm('Are you sure you want to delete this room?')) {
      console.log('Emitting delete_room event with ID:', roomId)

      socket.emit('delete_room', roomId, response => {
        console.log('Delete room response:', response)
        if (response && response.success) {
          console.log('Room deleted successfully')
          socket.emit('get_rooms')
        } else {
          console.error(
            'Failed to delete room:',
            response?.error || 'Unknown error',
          )
          alert(`Failed to delete room: ${response?.error || 'Unknown error'}`)
        }
      })
    }
  }

  // Container
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  }

  // Header
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  }

  // Header title
  const headerTitleStyle = {
    fontWeight: '500',
  }

  // Create room button
  const createButtonStyle = {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  // Room list container
  const roomListStyle = {
    flex: '1',
    overflowY: 'auto',
  }

  // Room item
  const getRoomItemStyle = isActive => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  })

  // Room content container
  const roomContentStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
  }

  // Room icon
  const roomIconStyle = {
    height: '1rem',
    width: '1rem',
    marginRight: '0.5rem',
  }

  // Room text container
  const roomTextStyle = {
    flex: '1',
    minWidth: '0',
  }

  // Room name
  const roomNameStyle = {
    fontWeight: '500',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  // Room last message
  const lastMessageStyle = {
    fontSize: '0.875rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }

  // Delete button
  const deleteButtonStyle = {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    opacity: '0',
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle} className='border-cream-200'>
        <h3 style={headerTitleStyle} className='text-cream-800'>
          {t('chat.rooms')}
        </h3>
        <button
          onClick={onCreateRoom}
          style={createButtonStyle}
          className='hover:bg-cream-50'
        >
          <Plus className='h-5 w-5 text-cream-600' />
        </button>
      </div>
      <div style={roomListStyle}>
        {rooms.map(room => (
          <div
            key={room._id}
            onClick={() => onRoomSelect(room._id)}
            style={getRoomItemStyle(activeRoomId === room._id)}
            className={`group
              ${
                activeRoomId === room._id
                  ? 'bg-cream-50 border-cream-600'
                  : 'hover:bg-cream-50/50 border-transparent'
              }`}
          >
            <div style={roomContentStyle}>
              {room.type === 'group' ? (
                <Hash style={roomIconStyle} className='text-cream-600' />
              ) : (
                <MessageCircle
                  style={roomIconStyle}
                  className='text-cream-600'
                />
              )}
              <div style={roomTextStyle}>
                <p style={roomNameStyle} className='text-cream-800'>
                  {room.name}
                </p>
                {room.lastMessage && (
                  <p style={lastMessageStyle} className='text-cream-600'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            {room.creator.toString() === user?._id && (
              <button
                onClick={e => handleDeleteRoom(e, room._id)}
                style={deleteButtonStyle}
                className='text-cream-400 hover:text-red-500 group-hover:opacity-100'
                title={t('chat.deleteRoom')}
              >
                <Trash2 className='h-4 w-4' />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RoomList
