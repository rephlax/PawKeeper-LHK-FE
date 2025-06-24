import React from 'react'
import { Link } from 'react-router-dom'
import { regularSidebarStyles as styles } from '../sidebar.styles'

const NavLink = ({ to, icon: Icon, children, isActive }) => {
  const linkClasses = isActive
    ? 'bg-cream-100 text-cream-800'
    : 'text-cream-600 hover:bg-cream-50 hover:text-cream-700'

  const iconClasses = isActive ? 'bg-cream-200' : 'bg-cream-50'

  return (
    <Link to={to} style={styles.nav.link.base} className={linkClasses}>
      <div style={styles.nav.icon.container} className={iconClasses}>
        <Icon style={styles.nav.icon.size} />
      </div>
      <span style={{ fontWeight: '500' }}>{children}</span>
    </Link>
  )
}

export default NavLink
