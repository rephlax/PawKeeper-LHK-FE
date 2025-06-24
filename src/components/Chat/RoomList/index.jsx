import { useState, useEffect } from 'react'
import { useSocket } from '../../../context/SocketContext'
import { Plus, Hash, MessageCircle, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { styles } from './RoomList.styles'

const RoomList = ({ onRoomSelect, activeRoomId, onCreateRoom }) => {
  const [rooms, setRooms] = useState([])
  const { socket, user } = useSocket()
  const { t } = useTranslation()

  useEffect(() => {
    if (!socket) return

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

    if (!roomId) return

    const roomToDelete = rooms.find(room => room._id === roomId)
    if (!roomToDelete) return

    if (roomToDelete.creator.toString() !== user?._id) {
      alert('You are not authorized to delete this room')
      return
    }

    if (window.confirm('Are you sure you want to delete this room?')) {
      socket.emit('delete_room', roomId, response => {
        if (response && response.success) {
          socket.emit('get_rooms')
        } else {
          alert(`Failed to delete room: ${response?.error || 'Unknown error'}`)
        }
      })
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header} className='border-cream-200'>
        <h3 style={styles.headerTitle} className='text-cream-800'>
          {t('chat.rooms')}
        </h3>
        <button
          onClick={onCreateRoom}
          style={styles.createButton}
          className='hover:bg-cream-50'
        >
          <Plus className='h-5 w-5 text-cream-600' />
        </button>
      </div>
      <div style={styles.roomList}>
        {rooms.map(room => (
          <div
            key={room._id}
            onClick={() => onRoomSelect(room._id)}
            style={styles.roomItem(activeRoomId === room._id)}
            className={`group ${
              activeRoomId === room._id
                ? 'bg-cream-50 border-cream-600'
                : 'hover:bg-cream-50/50 border-transparent'
            }`}
          >
            <div style={styles.roomContent}>
              {room.type === 'group' ? (
                <Hash style={styles.roomIcon} className='text-cream-600' />
              ) : (
                <MessageCircle
                  style={styles.roomIcon}
                  className='text-cream-600'
                />
              )}
              <div style={styles.roomText}>
                <p style={styles.roomName} className='text-cream-800'>
                  {room.name}
                </p>
                {room.lastMessage && (
                  <p style={styles.lastMessage} className='text-cream-600'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            {room.creator.toString() === user?._id && (
              <button
                onClick={e => handleDeleteRoom(e, room._id)}
                style={styles.deleteButton}
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
