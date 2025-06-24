import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styles } from './LanguageSwitcher.styles'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'pt', name: 'Português' },
  { code: 'uk', name: 'Українська' },
]

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  const changeLanguage = lng => {
    i18n.changeLanguage(lng)
    setMenuOpen(false)
  }

  return (
    <div style={styles.container}>
      <button
        style={styles.toggleButton}
        className='text-cream-700 hover:text-cream-800 hover:bg-cream-50'
        onClick={toggleMenu}
        aria-label='Change Language'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          style={styles.icon}
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
        <div style={styles.menu} className='bg-white border-cream-200'>
          <div style={styles.menuContent}>
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={styles.menuItem}
                className={`text-cream-700 hover:bg-cream-50 ${
                  i18n.language === lang.code ? 'bg-cream-50' : ''
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
