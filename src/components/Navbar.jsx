import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { MapPin } from 'lucide-react'

const Navbar = () => {
  const { t } = useTranslation()
  const { isSignedIn, user, handleLogout } = useAuth()

  // Navbar container
  const navbarStyle = {
    width: '100%',
    height: '5rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    backdropFilter: 'blur(4px)',
  }

  // Inner container
  const innerContainerStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
  }

  // Logo container
  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
  }

  // Logo image
  const logoStyle = {
    width: '20%',
    height: '20%',
    objectFit: 'contain',
    transition: 'transform 0.2s',
  }

  // Logo hover
  const handleLogoHover = e => {
    e.currentTarget.style.transform = 'scale(1.05)'
  }

  const handleLogoLeave = e => {
    e.currentTarget.style.transform = 'scale(1)'
  }

  // Links container
  const linksContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  const NavLink = ({ to, children, onClick }) => {
    // Link
    const linkStyle = {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
    }

    // Link hover
    const handleLinkHover = e => {
      e.currentTarget.classList.remove('text-cream-700', 'bg-transparent')
      e.currentTarget.classList.add('text-cream-800', 'bg-cream-50')
    }

    const handleLinkLeave = e => {
      e.currentTarget.classList.remove('text-cream-800', 'bg-cream-50')
      e.currentTarget.classList.add('text-cream-700', 'bg-transparent')
    }

    return (
      <Link
        to={to}
        onClick={onClick}
        style={linkStyle}
        className='text-cream-700 bg-transparent'
        onMouseOver={handleLinkHover}
        onMouseOut={handleLinkLeave}
      >
        {children}
      </Link>
    )
  }

  // Button
  const buttonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Button hover
  const handleButtonHover = e => {
    e.currentTarget.classList.remove('text-cream-700', 'bg-transparent')
    e.currentTarget.classList.add('text-cream-800', 'bg-cream-50')
  }

  const handleButtonLeave = e => {
    e.currentTarget.classList.remove('text-cream-800', 'bg-cream-50')
    e.currentTarget.classList.add('text-cream-700', 'bg-transparent')
  }

  // Language switcher
  const langSwitcherContainerStyle = {
    marginLeft: '1rem',
    paddingLeft: '1rem',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
  }

  // Map icon
  const mapIconStyle = {
    height: '1.5rem',
    width: '1.5rem',
  }

  // Map icon hover
  const handleMapIconHover = e => {
    e.currentTarget.classList.remove('text-cream-600')
    e.currentTarget.classList.add('text-cream-800')
  }

  const handleMapIconLeave = e => {
    e.currentTarget.classList.remove('text-cream-800')
    e.currentTarget.classList.add('text-cream-600')
  }

  return (
    <nav style={navbarStyle} className='bg-white/70 border-cream-200'>
      <div style={innerContainerStyle}>
        <div style={logoContainerStyle}>
          <Link
            to='/'
            onMouseOver={handleLogoHover}
            onMouseOut={handleLogoLeave}
          >
            <img style={logoStyle} src={logo} alt='PawKeeper Logo' />
          </Link>
        </div>

        <div style={linksContainerStyle}>
          {isSignedIn ? (
            <>
              <NavLink to='/map'>
                <MapPin
                  style={mapIconStyle}
                  className='text-cream-600'
                  onMouseOver={handleMapIconHover}
                  onMouseOut={handleMapIconLeave}
                />
              </NavLink>
              <NavLink to={`/users/user/${user._id}`}>
                {t('navbar.profile')}
              </NavLink>
              <button
                onClick={handleLogout}
                style={buttonStyle}
                className='text-cream-700 bg-transparent'
                onMouseOver={handleButtonHover}
                onMouseOut={handleButtonLeave}
              >
                {t('navbar.logout')}
              </button>
            </>
          ) : (
            <>
              <NavLink to='/sign-up'>{t('navbar.signup')}</NavLink>
              <NavLink to='/log-in'>{t('navbar.login')}</NavLink>
            </>
          )}

          <div style={langSwitcherContainerStyle} className='border-cream-200'>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
