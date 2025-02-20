import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className='w-full bg-white border-t border-cream-200'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10'>
        <div className='flex justify-between items-center h-full'>
          <div className='flex items-center gap-4 text-cream-700'>
            <span className='font-medium'>{t('footer.contact')}</span>
            <a
              href='mailto:PawKeeper@FakeEmail.com'
              className='hover:text-cream-800 transition-colors duration-200 
                       flex items-center gap-1'
            >
              <span className='text-lg'>✉️</span>
              <span className='hover:underline hidden sm:inline'>
                PawKeeper@FakeEmail.com
              </span>
            </a>
            <a
              href='tel:00000000'
              className='hover:text-cream-800 transition-colors duration-200 
                       flex items-center gap-1'
            >
              <span className='text-lg'>📞</span>
              <span className='hover:underline'>00000000</span>
            </a>
          </div>

          <p className='text-sm text-cream-600'>
            Copyright © 2025{' '}
            <span className='font-medium text-cream-800'>PawKeeper</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
