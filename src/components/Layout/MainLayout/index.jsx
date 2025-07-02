import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { styles } from './MainLayout.styles'

const MainLayout = ({
  children,
  sidebar = null,
  chatWidget = null,
  showBackgroundEffects = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div
      style={styles.container}
      className='bg-gradient-to-br from-cream-50 via-cream-100 to-cream-200'
    >
      {/* Background Effects */}
      {showBackgroundEffects && (
        <div style={styles.backgroundEffects}>
          <div style={styles.backgroundBlob1} />
          <div style={styles.backgroundBlob2} />
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <Navbar onMenuToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Sidebar */}
        {sidebar && (
          <aside
            style={{
              ...styles.sidebar,
              ...(isSidebarOpen ? styles.sidebarOpen : {}),
            }}
            className='border-cream-200'
          >
            {sidebar}
          </aside>
        )}

        {/* Main Area */}
        <main style={styles.mainArea}>{children}</main>
      </div>

      {/* Footer */}
      <div style={styles.footer} className='border-cream-200'>
        <Footer />
      </div>

      {/* Chat Widget */}
      {chatWidget && <div style={styles.chatWidget}>{chatWidget}</div>}
    </div>
  )
}

export default MainLayout
