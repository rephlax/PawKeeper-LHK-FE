import logo from '../assets/logo.png'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation()
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex flex-col items-center space-y-8'>
        <h1 className='text-4xl font-bold text-cream-800 text-center'>
          {t('homepage.welcome')}
        </h1>
        <div className='relative'>
          <div className='absolute inset-0 bg-cream-200 rounded-full blur-xl'></div>
          <img
            className='w-48 h-48 relative z-10 transform hover:scale-105 transition-transform duration-300'
            src={logo}
            alt='Pawkeeper logo'
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
