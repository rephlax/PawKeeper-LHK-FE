import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const NavLink = ({ to, icon: Icon, children, isActive }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
      ${
        isActive
          ? 'bg-cream-100 text-cream-800'
          : 'text-cream-600 hover:bg-cream-50 hover:text-cream-700'
      }
    `}
  >
    <div
      className={`
      flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
      ${isActive ? 'bg-cream-200' : 'bg-cream-50'}
    `}
    >
      <Icon className='w-5 h-5' />
    </div>
    <span className='font-medium'>{children}</span>
  </Link>
)

const RegularSidebar = ({ user }) => {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <div className='h-full flex flex-col p-6'>
      <div className='mb-8'>
        <h2 className='text-xl font-semibold text-cream-800 px-4'>
          {t('sidebar.nav')}
        </h2>
      </div>

      <nav className='space-y-2'>
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
        <div className='mt-auto pt-6 border-t border-cream-200'>
          <div className='flex items-center gap-3 px-4 py-3 rounded-lg bg-cream-50'>
            <div className='w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center'>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className='w-full h-full rounded-full object-cover'
                />
              ) : (
                <User className='w-6 h-6 text-cream-600' />
              )}
            </div>
            <div>
              <p className='font-medium text-cream-800'>{user.username}</p>
              <p className='text-sm text-cream-600'>
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
