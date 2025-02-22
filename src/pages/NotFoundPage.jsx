import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()

  // Container
  const containerStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '48rem',
    margin: '0 auto',
  }

  // Title
  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    marginBottom: '2rem',
  }

  // Image container
  const imageContainerStyle = {
    position: 'relative',
    width: '16rem',
    height: '16rem',
    margin: '0 auto',
    marginBottom: '2rem',
  }

  // Image
  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '2px',
    borderStyle: 'solid',
  }

  // Button
  const buttonStyle = {
    display: 'inline-block',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    color: 'white',
  }

  // Button hover state management
  const handleButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handleButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle} className='text-cream-800'>
        {t('notfoundpage.notfound')}
      </h1>

      <div style={imageContainerStyle}>
        <img
          src='https://content.imageresizer.com/images/memes/Surprised-Dog-meme-9.jpg'
          alt='Shocked dog'
          style={imageStyle}
          className='border-cream-200'
        />
      </div>

      <Link
        to='/'
        style={buttonStyle}
        className='bg-cream-600'
        onMouseOver={handleButtonHover}
        onMouseOut={handleButtonLeave}
      >
        {t('notfoundpage.backhome')}
      </Link>
    </div>
  )
}

export default NotFoundPage
