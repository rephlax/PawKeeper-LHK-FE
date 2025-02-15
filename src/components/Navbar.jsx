import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { MapPin } from 'lucide-react'

const Navbar = () => {
  const { t } = useTranslation()
  const { isSignedIn, user, handleLogout, isMapOpen, setIsMapOpen } = useAuth()

  return (
    <nav className='flex items-center justify-between h-full px-8 relative'>
      <div className='navbar-logo'>
        <Link to='/'>
          <img className='w-20 h-20' src={logo} alt='PawKeeper Logo' />
        </Link>
      </div>

      <div
        className='flex gap-4 justify-evenly items-center text-lg'
        style={{ paddingRight: '10px' }}
      >
        {!isSignedIn ? (
          <>
            <Link to='/sign-up' className='navbar-link'>
              {t('navbar.signup')}
            </Link>
            <Link to='/log-in' className='navbar-link'>
              {t('navbar.login')}
            </Link>
          </>
        ) : (
          <>
            <Link
              to='/map'
              className='text-cream-text hover:text-cream-accent transition-colors'
            >
              <MapPin className='h-6 w-6' />
            </Link>

            <Link to={`/users/user/${user._id}`} className='navbar-link'>
              {t('navbar.profile')}
            </Link>

            <button onClick={handleLogout} className='navbar-link'>
              {t('navbar.logout')}
            </button>
          </>
        )}

        <div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
