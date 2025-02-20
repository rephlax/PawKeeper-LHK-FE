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

  return (
    <div className='relative'>
      <button
        className='p-2 text-cream-700 hover:text-cream-800 hover:bg-cream-50 
                   rounded-lg transition-colors duration-200'
        onClick={toggleMenu}
        aria-label='Change Language'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
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
        <div
          className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg 
                      border border-cream-200 overflow-hidden z-50'
        >
          <div className='py-1'>
            <button
              onClick={() => changeLanguage('en')}
              className='w-full px-4 py-2 text-left text-cream-700 hover:bg-cream-50 
                       transition-colors duration-200'
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('pt')}
              className='w-full px-4 py-2 text-left text-cream-700 hover:bg-cream-50 
                       transition-colors duration-200'
            >
              Português
            </button>
            <button
              onClick={() => changeLanguage('uk')}
              className='w-full px-4 py-2 text-left text-cream-700 hover:bg-cream-50 
                       transition-colors duration-200'
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
