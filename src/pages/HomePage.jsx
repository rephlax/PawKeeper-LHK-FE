import logo from '../assets/logo.png'
import { useTranslation } from 'react-i18next'

const HomePage = () => {
  const { t } = useTranslation()

  // Container
  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  // Content wrapper
  const contentWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }

  // Title
  const titleStyle = {
    fontSize: '3.75rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
  }

  // Logo container
  const logoContainerStyle = {
    position: 'relative',
    width: '368px',
    height: '368px',
  }

  // Blur effect
  const blurEffectStyle = {
    position: 'absolute',
    inset: '0',
    borderRadius: '9999px',
    filter: 'blur(24px)',
  }

  // Logo image
  const logoImageStyle = {
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: '10',
    transition: 'transform 0.3s',
  }

  return (
    <div style={containerStyle}>
      <div style={contentWrapperStyle}>
        <h1 style={titleStyle} className='text-cream-text'>
          {t('homepage.welcome')}
        </h1>
        <div style={logoContainerStyle}>
          <div style={blurEffectStyle} className='bg-cream-200'></div>
          <img
            style={logoImageStyle}
            src={logo}
            alt='Pawkeeper logo'
            onMouseOver={e => {
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseOut={e => {
              e.target.style.transform = 'scale(1)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage
