import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useTranslation } from 'react-i18next'

const CreateRoomModal = ({ onClose, onCreateRoom }) => {
  const { t } = useTranslation()
  const [roomName, setRoomName] = useState('')
  const [type, setType] = useState('group')
  const [users, setUsers] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([])
  const { socket } = useSocket()
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/users/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data.filter(user => user._id !== socket?.user?._id))
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [socket, BACKEND_URL])

  const toggleParticipant = user => {
    setSelectedParticipants(prev =>
      prev.some(p => p._id === user._id)
        ? prev.filter(p => p._id !== user._id)
        : [...prev, user],
    )
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!roomName.trim()) {
      alert('Please enter a room name')
      return
    }

    if (type === 'group' && selectedParticipants.length === 0) {
      alert('Please select at least one participant for a group chat')
      return
    }

    const roomData = {
      name: roomName,
      type,
      participants: selectedParticipants.map(p => p._id),
    }

    console.log('Creating room with data:', roomData)
    onCreateRoom(roomData)
    onClose()
  }

  return (
    <div className='fixed inset-0 bg-cream-900/50 backdrop-blur-sm flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl p-6 w-96 max-h-[90vh] flex flex-col shadow-xl'>
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-lg font-medium text-cream-800'>
            {t('chat.newcreate')}
          </h3>
          <button
            onClick={onClose}
            className='p-1 hover:bg-cream-50 rounded-md transition-colors duration-200'
          >
            <X className='h-5 w-5 text-cream-600' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col flex-1'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-cream-700 mb-1'>
                {t('chat.name')}
              </label>
              <input
                type='text'
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                className='w-full px-3 py-2 text-sm border border-cream-300 rounded-md
                         focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                         transition duration-200 placeholder:text-cream-400'
                placeholder={t('chat.enterName')}
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-cream-700 mb-1'>
                {t('chat.type')}
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className='w-full px-3 py-2 text-sm border border-cream-300 rounded-md
                         focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                         transition duration-200'
              >
                <option value='group'>{t('chat.group')}</option>
                <option value='direct'>{t('chat.direct')}</option>
              </select>
            </div>

            {type === 'group' && (
              <div className='flex-1 overflow-y-auto'>
                <label className='block text-sm font-medium text-cream-700 mb-2'>
                  {t('chat.participants')}
                </label>
                <div className='space-y-2 max-h-[240px] overflow-y-auto pr-2'>
                  {users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => toggleParticipant(user)}
                      className={`flex items-center p-3 rounded-lg cursor-pointer
                        transition-colors duration-200 border
                        ${
                          selectedParticipants.some(p => p._id === user._id)
                            ? 'bg-cream-50 border-cream-400'
                            : 'border-cream-200 hover:bg-cream-50/50'
                        }`}
                    >
                      <div className='flex-1 flex items-center gap-3'>
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className='w-10 h-10 rounded-full object-cover border-2 border-cream-200'
                          />
                        ) : (
                          <div
                            className='w-10 h-10 rounded-full bg-cream-100 border-2 border-cream-200
                                      flex items-center justify-center text-cream-600 font-medium'
                          >
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className='font-medium text-cream-800'>
                            {user.username}
                          </p>
                          {user.sitter && (
                            <p className='text-xs text-cream-600'>
                              {t('userlist.petsitter')}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedParticipants.some(p => p._id === user._id) && (
                        <Check className='text-cream-600 h-5 w-5' />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className='flex justify-end gap-2 mt-6 pt-4 border-t border-cream-200'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm border-2 border-cream-400 text-cream-700
                       rounded-md hover:bg-cream-50 transition-colors duration-200'
            >
              {t('chat.cancel')}
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm bg-cream-600 text-white rounded-md
                       hover:bg-cream-700 transition-colors duration-200'
            >
              {t('chat.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoomModal
