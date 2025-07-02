import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { useSocket } from '../../../context/SocketContext'
import { useTranslation } from 'react-i18next'
import { styles } from './CreateRoomModal.styles'

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
    <div style={styles.overlay} className='bg-cream-900/50'>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.headerTitle} className='text-cream-800'>
            {t('chat.newcreate')}
          </h3>
          <button
            onClick={onClose}
            style={styles.closeButton}
            className='hover:bg-cream-50'
          >
            <X className='h-5 w-5 text-cream-600' />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formFields}>
            <div style={styles.inputGroup}>
              <label style={styles.label} className='text-cream-700'>
                {t('chat.name')}
              </label>
              <input
                type='text'
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                style={styles.input}
                className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent placeholder:text-cream-400'
                placeholder={t('chat.enterName')}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label} className='text-cream-700'>
                {t('chat.type')}
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                style={styles.input}
                className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent'
              >
                <option value='group'>{t('chat.group')}</option>
                <option value='direct'>{t('chat.direct')}</option>
              </select>
            </div>

            {type === 'group' && (
              <div style={styles.participantsList}>
                <label style={styles.label} className='text-cream-700'>
                  {t('chat.participants')}
                </label>
                <div style={styles.participantsContainer}>
                  {users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => toggleParticipant(user)}
                      style={styles.participantItem}
                      className={
                        selectedParticipants.some(p => p._id === user._id)
                          ? 'bg-cream-50 border-cream-400'
                          : 'border-cream-200 hover:bg-cream-50/50'
                      }
                    >
                      <div style={styles.userInfo}>
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            style={styles.avatar}
                            className='border-cream-200'
                          />
                        ) : (
                          <div
                            style={styles.avatarPlaceholder}
                            className='bg-cream-100 border-cream-200 text-cream-600'
                          >
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div style={styles.userText}>
                          <p style={styles.username} className='text-cream-800'>
                            {user.username}
                          </p>
                          {user.sitter && (
                            <p
                              style={styles.userRole}
                              className='text-cream-600'
                            >
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

          <div style={styles.footer} className='border-cream-200'>
            <button
              type='button'
              onClick={onClose}
              style={styles.cancelButton}
              className='border-cream-400 text-cream-700 hover:bg-cream-50'
            >
              {t('chat.cancel')}
            </button>
            <button
              type='submit'
              style={styles.createButton}
              className='bg-cream-600 text-white hover:bg-cream-700'
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
