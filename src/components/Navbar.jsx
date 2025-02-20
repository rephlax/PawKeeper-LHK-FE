import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { MapPin } from 'lucide-react'

const NavLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className='px-4 py-2 text-cream-700 hover:text-cream-800 
             hover:bg-cream-50 rounded-lg transition-all duration-200'
  >
    {children}
  </Link>
)

const Navbar = () => {
  const { t } = useTranslation()
  const { isSignedIn, user, userId, handleLogout, isMapOpen, setIsMapOpen } =
    useAuth()

  return (
    <nav className='flex items-center justify-between h-full px-8 max-w-7xl mx-auto'>
      <div className='flex items-center'>
        <Link
          to='/'
          className='transform hover:scale-105 transition-transform duration-200'
        >
          <img
            className='w-16 h-16 object-contain'
            src={logo}
            alt='PawKeeper Logo'
          />
        </Link>
      </div>

      <div className='flex items-center gap-2'>
        {!isSignedIn ? (
          <>
            <NavLink to='/sign-up'>{t('navbar.signup')}</NavLink>
            <NavLink to='/log-in'>{t('navbar.login')}</NavLink>
          </>
        ) : (
          <>
            <NavLink to='/map'>
              <MapPin
                className='h-5 w-5 text-cream-600 hover:text-cream-800 
                               transition-colors duration-200'
              />
            </NavLink>
            <NavLink to={`/users/user/${user._id}`}>
              {t('navbar.profile')}
            </NavLink>
            <button
              onClick={handleLogout}
              className='px-4 py-2 text-cream-700 hover:text-cream-800 
                       hover:bg-cream-50 rounded-lg transition-all duration-200'
            >
              {t('navbar.logout')}
            </button>
          </>
        )}

        <div className='ml-4 pl-4 border-l border-cream-200'>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
