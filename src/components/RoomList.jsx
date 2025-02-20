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

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center p-4 border-b border-cream-200'>
        <h3 className='font-medium text-cream-800'>{t('chat.rooms')}</h3>
        <button
          onClick={onCreateRoom}
          className='p-1.5 hover:bg-cream-50 rounded-md transition-colors duration-200'
        >
          <Plus className='h-5 w-5 text-cream-600' />
        </button>
      </div>
      <div className='flex-1 overflow-y-auto'>
        {rooms.map(room => (
          <div
            key={room._id}
            onClick={() => onRoomSelect(room._id)}
            className={`flex items-center p-3 cursor-pointer transition-colors duration-200 group
              ${
                activeRoomId === room._id
                  ? 'bg-cream-50 border-l-4 border-cream-600'
                  : 'hover:bg-cream-50/50 border-l-4 border-transparent'
              }`}
          >
            <div className='flex-1 flex items-center'>
              {room.type === 'group' ? (
                <Hash className='h-4 w-4 mr-2 text-cream-600' />
              ) : (
                <MessageCircle className='h-4 w-4 mr-2 text-cream-600' />
              )}
              <div className='flex-1 min-w-0'>
                <p className='font-medium text-cream-800 truncate'>
                  {room.name}
                </p>
                {room.lastMessage && (
                  <p className='text-sm text-cream-600 truncate'>
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            </div>
            {room.creator.toString() === user?._id && (
              <button
                onClick={e => handleDeleteRoom(e, room._id)}
                className='p-1.5 text-cream-400 hover:text-red-500 rounded-md 
               transition-colors duration-200 opacity-0 group-hover:opacity-100'
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
