import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
    setMenuOpen(false)
  }

  // Container
  const containerStyle = {
    position: 'relative',
  }

  // Toggle button
  const toggleButtonStyle = {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // SVG icon
  const iconStyle = {
    width: '20px',
    height: '20px',
  }

  // Menu
  const menuStyle = {
    position: 'absolute',
    right: '0',
    marginTop: '0.5rem',
    width: '12rem',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    zIndex: '50',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  // Menu content
  const menuContentStyle = {
    padding: '0.25rem 0',
  }

  // Menu item
  const menuItemStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'left',
    transition: 'background-color 0.2s',
  }

  return (
    <div style={containerStyle}>
      <button
        style={toggleButtonStyle}
        className='text-cream-700 hover:text-cream-800 hover:bg-cream-50'
        onClick={toggleMenu}
        aria-label='Change Language'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          style={iconStyle}
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <circle cx='12' cy='12' r='10'></circle>
          <line x1='2' y1='12' x2='22' y2='12'></line>
          <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'></path>
        </svg>
      </button>

      {menuOpen && (
        <div style={menuStyle} className='bg-white border-cream-200'>
          <div style={menuContentStyle}>
            <button
              onClick={() => changeLanguage('en')}
              style={menuItemStyle}
              className='text-cream-700 hover:bg-cream-50'
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('pt')}
              style={menuItemStyle}
              className='text-cream-700 hover:bg-cream-50'
            >
              Português
            </button>
            <button
              onClick={() => changeLanguage('uk')}
              style={menuItemStyle}
              className='text-cream-700 hover:bg-cream-50'
            >
              Українська
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
