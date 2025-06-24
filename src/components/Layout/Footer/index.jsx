import React from 'react'
import { useTranslation } from 'react-i18next'
import { styles } from './Footer.styles'

const Footer = () => {
  const { t } = useTranslation()

  const handleLinkHover = e => {
    e.currentTarget.classList.remove('text-cream-700')
    e.currentTarget.classList.add('text-cream-800')
    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'underline'
  }

  const handleLinkLeave = e => {
    e.currentTarget.classList.remove('text-cream-800')
    e.currentTarget.classList.add('text-cream-700')
    const span = e.currentTarget.querySelector('.underline-on-hover')
    if (span) span.style.textDecoration = 'none'
  }

  return (
    <footer
      style={styles.footer.container}
      className='bg-white border-cream-200'
    >
      <div style={styles.footer.innerContainer}>
        <div style={styles.contact.container} className='text-cream-700'>
          <span style={styles.contact.label}>{t('footer.contact')}</span>

          <div style={styles.contact.linksContainer}>
            <a
              href='mailto:PawKeeper@FakeEmail.com'
              style={styles.contact.link}
              className='text-cream-700'
              onMouseOver={handleLinkHover}
              onMouseOut={handleLinkLeave}
            >
              <span style={styles.contact.icon}>✉️</span>
              <span className='underline-on-hover hidden sm:inline'>
                PawKeeper@FakeEmail.com
              </span>
            </a>

            <a
              href='tel:00000000'
              style={styles.contact.link}
              className='text-cream-700'
              onMouseOver={handleLinkHover}
              onMouseOut={handleLinkLeave}
            >
              <span style={styles.contact.icon}>📞</span>
              <span className='underline-on-hover'>00000000</span>
            </a>
          </div>
        </div>

        <p style={styles.copyright.text} className='text-cream-600'>
          Copyright © 2025{' '}
          <span style={styles.copyright.companyName} className='text-cream-800'>
            PawKeeper
          </span>
        </p>
      </div>
    </footer>
  )
}

export default Footer
