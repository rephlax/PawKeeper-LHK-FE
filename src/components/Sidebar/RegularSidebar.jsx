import React from 'react'
import { useLocation } from 'react-router-dom'
import { Home, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import NavLink from './components/NavLink'
import UserProfile from './components/UserProfile'
import { regularSidebarStyles as styles } from './sidebar.styles'

const getNavItems = (user, t) =>
  [
    {
      to: '/',
      icon: Home,
      label: t('sidebar.home'),
      isActive: pathname => pathname === '/',
    },
    user && {
      to: `/users/user/${user._id}`,
      icon: User,
      label: t('sidebar.profile'),
      isActive: pathname => pathname.includes(`/users/user/${user._id}`),
    },
  ].filter(Boolean)

const RegularSidebar = ({ user }) => {
  const location = useLocation()
  const { t } = useTranslation()

  const navItems = getNavItems(user, t)

  return (
    <div style={styles.container}>
      <header style={styles.header.container}>
        <h2 style={styles.header.title} className='text-cream-800'>
          {t('sidebar.nav')}
        </h2>
      </header>

      <nav style={styles.nav.container}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            isActive={item.isActive(location.pathname)}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <UserProfile user={user} />
    </div>
  )
}

export default RegularSidebar
