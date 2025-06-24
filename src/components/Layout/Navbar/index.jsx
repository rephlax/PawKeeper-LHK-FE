import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import LanguageSwitcher from '../../Common/LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../context/AuthContext'
import { MapPin, Menu, X } from 'lucide-react'
import { styles } from './Navbar.styles'

const NavLink = ({ to, children, onClick, className = '' }) => {
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
      style={styles.navigation.link}
      className={`text-cream-700 bg-transparent ${className}`}
      onMouseOver={handleLinkHover}
      onMouseOut={handleLinkLeave}
    >
      {children}
    </Link>
  )
}

const Navbar = () => {
  const { t } = useTranslation()
  const { isSignedIn, user, handleLogout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogoHover = e => {
    e.currentTarget.style.transform = 'scale(1.025)'
  }

  const handleLogoLeave = e => {
    e.currentTarget.style.transform = 'scale(1)'
  }

  const handleButtonHover = e => {
    e.currentTarget.classList.remove('text-cream-700', 'bg-transparent')
    e.currentTarget.classList.add('text-cream-800', 'bg-cream-50')
  }

  const handleButtonLeave = e => {
    e.currentTarget.classList.remove('text-cream-800', 'bg-cream-50')
    e.currentTarget.classList.add('text-cream-700', 'bg-transparent')
  }

  const handleMapIconHover = e => {
    e.currentTarget.classList.remove('text-cream-600')
    e.currentTarget.classList.add('text-cream-800')
  }

  const handleMapIconLeave = e => {
    e.currentTarget.classList.remove('text-cream-800')
    e.currentTarget.classList.add('text-cream-600')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        style={styles.navbar.container}
        className='bg-white/70 border-cream-200'
      >
        <div style={styles.navbar.innerContainer}>
          <div style={styles.logo.container}>
            <Link
              to='/'
              onMouseOver={handleLogoHover}
              onMouseOut={handleLogoLeave}
            >
              <img style={styles.logo.image} src={logo} alt='PawKeeper Logo' />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div style={styles.navigation.container} className='hidden md:flex'>
            {isSignedIn ? (
              <>
                <NavLink to='/map'>
                  <MapPin
                    style={styles.mapIcon}
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
                  style={styles.navigation.button}
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

            <div
              style={styles.navigation.langSwitcher}
              className='border-cream-200'
            >
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className='md:hidden text-cream-700 hover:text-cream-800'
            style={{ padding: '0.5rem' }}
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div style={styles.mobileMenu.overlay} onClick={closeMobileMenu} />
          <div
            style={{
              ...styles.mobileMenu.menu,
              ...(isMobileMenuOpen ? styles.mobileMenu.menuOpen : {}),
            }}
          >
            <div style={styles.mobileMenu.menuContent}>
              <button
                onClick={closeMobileMenu}
                style={styles.mobileMenu.closeButton}
                className='text-cream-700 hover:text-cream-800'
              >
                <X size={24} />
              </button>

              {isSignedIn ? (
                <>
                  <NavLink to='/map' onClick={closeMobileMenu}>
                    <MapPin size={20} className='inline mr-2' />
                    {t('navbar.map')}
                  </NavLink>
                  <NavLink
                    to={`/users/user/${user._id}`}
                    onClick={closeMobileMenu}
                  >
                    {t('navbar.profile')}
                  </NavLink>
                  <button
                    onClick={() => {
                      handleLogout()
                      closeMobileMenu()
                    }}
                    style={styles.navigation.button}
                    className='text-cream-700 bg-transparent text-left'
                  >
                    {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <>
                  <NavLink to='/sign-up' onClick={closeMobileMenu}>
                    {t('navbar.signup')}
                  </NavLink>
                  <NavLink to='/log-in' onClick={closeMobileMenu}>
                    {t('navbar.login')}
                  </NavLink>
                </>
              )}

              <div className='mt-4 pt-4 border-t border-cream-200'>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
