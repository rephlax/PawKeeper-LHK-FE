import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const NavLink = ({ to, icon: Icon, children, isActive }) => {
  // NavLink container
  const navLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Icon container
  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Icon
  const iconStyle = {
    width: '1.25rem',
    height: '1.25rem',
  }

  return (
    <Link
      to={to}
      style={navLinkStyle}
      className={
        isActive
          ? 'bg-cream-100 text-cream-800'
          : 'text-cream-600 hover:bg-cream-50 hover:text-cream-700'
      }
    >
      <div
        style={iconContainerStyle}
        className={isActive ? 'bg-cream-200' : 'bg-cream-50'}
      >
        <Icon style={iconStyle} />
      </div>
      <span style={{ fontWeight: '500' }}>{children}</span>
    </Link>
  )
}

const RegularSidebar = ({ user }) => {
  const location = useLocation()
  const { t } = useTranslation()

  // Sidebar container
  const sidebarContainerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
  }

  // Header container
  const headerContainerStyle = {
    marginBottom: '2rem',
  }

  // Header title
  const headerTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  }

  // Navigation container
  const navContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // User profile container
  const userProfileContainerStyle = {
    marginTop: 'auto',
    paddingTop: '1.5rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // User card
  const userCardStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
  }

  // Avatar container
  const avatarContainerStyle = {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '9999px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  // Avatar image
  const avatarImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '9999px',
    objectFit: 'cover',
  }

  // User icon
  const userIconStyle = {
    width: '1.5rem',
    height: '1.5rem',
  }

  // User info container
  const userInfoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  // Username
  const usernameStyle = {
    fontWeight: '500',
  }

  // User role
  const userRoleStyle = {
    fontSize: '0.875rem',
  }

  return (
    <div style={sidebarContainerStyle}>
      <div style={headerContainerStyle}>
        <h2 style={headerTitleStyle} className='text-cream-800'>
          {t('sidebar.nav')}
        </h2>
      </div>

      <nav style={navContainerStyle}>
        <NavLink to='/' icon={Home} isActive={location.pathname === '/'}>
          {t('sidebar.home')}
        </NavLink>

        {user && (
          <NavLink
            to={`/users/user/${user._id}`}
            icon={User}
            isActive={location.pathname.includes(`/users/user/${user._id}`)}
          >
            {t('sidebar.profile')}
          </NavLink>
        )}
      </nav>

      {user && (
        <div style={userProfileContainerStyle} className='border-cream-200'>
          <div style={userCardStyle} className='bg-cream-50'>
            <div style={avatarContainerStyle} className='bg-cream-200'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  style={avatarImageStyle}
                />
              ) : (
                <User style={userIconStyle} className='text-cream-600' />
              )}
            </div>
            <div style={userInfoContainerStyle}>
              <p style={usernameStyle} className='text-cream-800'>
                {user.username}
              </p>
              <p style={userRoleStyle} className='text-cream-600'>
                {user.sitter ? 'Pet Sitter' : 'Pet Owner'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegularSidebar
