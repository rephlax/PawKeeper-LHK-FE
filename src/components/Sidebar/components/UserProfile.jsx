import React from 'react'
import { User } from 'lucide-react'
import { regularSidebarStyles as styles } from '../sidebar.styles'

const UserProfile = ({ user }) => {
  if (!user) return null

  const userRole = user.sitter ? 'Pet Sitter' : 'Pet Owner'

  return (
    <div style={styles.userProfile.container} className='border-cream-200'>
      <div style={styles.userProfile.card} className='bg-cream-50'>
        <div
          style={styles.userProfile.avatar.container}
          className='bg-cream-200'
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              style={styles.userProfile.avatar.image}
            />
          ) : (
            <User
              style={{ width: '1.5rem', height: '1.5rem' }}
              className='text-cream-600'
            />
          )}
        </div>
        <div style={styles.userProfile.info.container}>
          <p
            style={styles.userProfile.info.username}
            className='text-cream-800'
          >
            {user.username}
          </p>
          <p style={styles.userProfile.info.role} className='text-cream-600'>
            {userRole}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
