import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  // Footer container
  const footerStyle = {
    width: '100%',
    height: '2.5rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
  }

  // Inner container
  const innerContainerStyle = {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 1rem',
  }

  // Contact container
  const contactContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  }

  // Contact label
  const contactLabelStyle = {
    fontWeight: '500',
  }

  const emailLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'color 0.2s',
  }

  // Email hover
  const handleEmailHover = e => {
    e.currentTarget.classList.remove('text-cream-700')
    e.currentTarget.classList.add('text-cream-800')

    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'underline'
  }
  // Email leave
  const handleEmailLeave = e => {
    e.currentTarget.classList.remove('text-cream-800')
    e.currentTarget.classList.add('text-cream-700')

    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'none'
  }

  // Email icon
  const emailIconStyle = {
    fontSize: '1.125rem',
  }

  // Email text
  const emailTextStyle = {
    display: 'none',
  }

  if (window.innerWidth >= 640) {
    emailTextStyle.display = 'inline'
  }

  // Phone link
  const phoneLinkStyle = { ...emailLinkStyle }

  // Phone hover
  const handlePhoneHover = e => {
    e.currentTarget.classList.remove('text-cream-700')
    e.currentTarget.classList.add('text-cream-800')

    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'underline'
  }

  const handlePhoneLeave = e => {
    e.currentTarget.classList.remove('text-cream-800')
    e.currentTarget.classList.add('text-cream-700')

    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'none'
  }

  // Phone icon
  const phoneIconStyle = { ...emailIconStyle }

  // Copyright text
  const copyrightStyle = {
    fontSize: '0.875rem',
  }

  // Company name
  const companyNameStyle = {
    fontWeight: '500',
  }

  return (
    <footer style={footerStyle} className='bg-white border-cream-200'>
      <div style={innerContainerStyle}>
        <div style={contactContainerStyle} className='text-cream-700'>
          <span style={contactLabelStyle}>{t('footer.contact')}</span>

          <a
            href='mailto:PawKeeper@FakeEmail.com'
            style={emailLinkStyle}
            className='text-cream-700'
            onMouseOver={handleEmailHover}
            onMouseOut={handleEmailLeave}
          >
            <span style={emailIconStyle}>✉️</span>
            <span
              style={emailTextStyle}
              className='underline-on-hover sm:inline'
            >
              PawKeeper@FakeEmail.com
            </span>
          </a>

          <a
            href='tel:00000000'
            style={phoneLinkStyle}
            className='text-cream-700'
            onMouseOver={handlePhoneHover}
            onMouseOut={handlePhoneLeave}
          >
            <span style={phoneIconStyle}>📞</span>
            <span className='underline-on-hover'>00000000</span>
          </a>
        </div>

        <p style={copyrightStyle} className='text-cream-600'>
          Copyright © 2025{' '}
          <span style={companyNameStyle} className='text-cream-800'>
            PawKeeper
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
