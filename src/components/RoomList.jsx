import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { Plus, Hash, MessageCircle, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

    return () => {
      socket.off('rooms_list')
      socket.off('room_created')
      socket.off('room_joined')
      socket.off('room_deleted')
    }
  }, [socket])

  const handleDeleteRoom = (e, roomId) => {
    e.stopPropagation()

    console.log('Delete room initiated:', {
      roomId,
      user: user,
      userCreatedRooms: rooms.filter(room => room.creator === user?._id),
      socketConnected: socket.connected,
    })

    if (window.confirm(t('chat.confirmDelete'))) {
      socket.emit('delete_room', roomId, response => {
        console.log('Delete room server response:', response)

        if (response?.error) {
          console.error('Room deletion error:', response)
          alert(response.message || 'Failed to delete room')
        } else if (response?.success) {
          console.log('Room deletion confirmed by server')
        } else {
          console.warn('Unexpected response from delete_room:', response)
          alert('An unexpected error occurred while deleting the room')
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
