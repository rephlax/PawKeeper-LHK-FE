import React from 'react'
import { styles } from './Card.styles'

const Card = ({
  children,
  header,
  footer,
  hoverable = false,
  onClick,
  className = '',
  ...props
}) => {
  const cardStyle = {
    ...styles.card.base,
    ...(hoverable ? styles.card.hoverable : {}),
  }

  return (
    <div
      style={cardStyle}
      className={`bg-white border border-cream-200 ${
        hoverable ? 'hover:shadow-lg hover:border-cream-300' : ''
      } ${className}`}
      onClick={onClick}
      {...props}
    >
      {header && (
        <div style={styles.header} className='border-cream-200'>
          {header}
        </div>
      )}

      <div style={styles.body}>{children}</div>

      {footer && (
        <div style={styles.footer} className='border-cream-200'>
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
