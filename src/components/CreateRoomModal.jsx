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

  // Modal overlay
  const overlayStyle = {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '50',
    backdropFilter: 'blur(4px)',
  }

  // Modal container
  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    width: '24rem',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  }

  // Header
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  }

  // Header title
  const headerTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '500',
  }

  // Close button
  const closeButtonStyle = {
    padding: '0.25rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  // Form
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
  }

  // Form fields container
  const formFieldsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Input group
  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  // Label
  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.25rem',
  }

  // Input
  const inputStyle = {
    width: '100%',
    paddingLeft: '0.75rem',
    paddingRight: '0.75rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '0.875rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
  }

  // Participants list
  const participantsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: '1',
    overflowY: 'auto',
  }

  // Participants container
  const participantsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '15rem',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  }

  // Participant item
  const participantItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // User info container
  const userInfoStyle = {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  }

  // Avatar
  const avatarStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    objectFit: 'cover',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  // Avatar placeholder
  const avatarPlaceholderStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    borderWidth: '2px',
    borderStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
  }

  // User text container
  const userTextStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  // Username
  const usernameStyle = {
    fontWeight: '500',
  }

  // User role
  const userRoleStyle = {
    fontSize: '0.75rem',
  }

  // Footer
  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // Cancel button
  const cancelButtonStyle = {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '0.875rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  // Create button
  const createButtonStyle = {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  }

  return (
    <div style={overlayStyle} className='bg-cream-900/50'>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={headerTitleStyle} className='text-cream-800'>
            {t('chat.newcreate')}
          </h3>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            className='hover:bg-cream-50'
          >
            <X className='h-5 w-5 text-cream-600' />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formFieldsStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle} className='text-cream-700'>
                {t('chat.name')}
              </label>
              <input
                type='text'
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
                style={inputStyle}
                className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent placeholder:text-cream-400'
                placeholder={t('chat.enterName')}
                required
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle} className='text-cream-700'>
                {t('chat.type')}
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                style={inputStyle}
                className='border-cream-300 focus:ring-2 focus:ring-cream-400 focus:border-transparent'
              >
                <option value='group'>{t('chat.group')}</option>
                <option value='direct'>{t('chat.direct')}</option>
              </select>
            </div>

            {type === 'group' && (
              <div style={participantsListStyle}>
                <label style={labelStyle} className='text-cream-700'>
                  {t('chat.participants')}
                </label>
                <div style={participantsContainerStyle}>
                  {users.map(user => (
                    <div
                      key={user._id}
                      onClick={() => toggleParticipant(user)}
                      style={{
                        ...participantItemStyle,
                      }}
                      className={
                        selectedParticipants.some(p => p._id === user._id)
                          ? 'bg-cream-50 border-cream-400'
                          : 'border-cream-200 hover:bg-cream-50/50'
                      }
                    >
                      <div style={userInfoStyle}>
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            style={avatarStyle}
                            className='border-cream-200'
                          />
                        ) : (
                          <div
                            style={avatarPlaceholderStyle}
                            className='bg-cream-100 border-cream-200 text-cream-600'
                          >
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div style={userTextStyle}>
                          <p style={usernameStyle} className='text-cream-800'>
                            {user.username}
                          </p>
                          {user.sitter && (
                            <p style={userRoleStyle} className='text-cream-600'>
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

          <div style={footerStyle} className='border-cream-200'>
            <button
              type='button'
              onClick={onClose}
              style={cancelButtonStyle}
              className='border-cream-400 text-cream-700 hover:bg-cream-50'
            >
              {t('chat.cancel')}
            </button>
            <button
              type='submit'
              style={createButtonStyle}
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
