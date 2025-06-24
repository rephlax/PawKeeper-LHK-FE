import React from 'react'
import { styles, maxWidthClasses } from './PageWrapper.styles'

const PageWrapper = ({
  children,
  maxWidth = '3xl',
  className = '',
  centered = true,
  padding = true,
}) => {
  const containerStyle = {
    ...styles.container,
    ...(centered ? {} : { alignItems: 'flex-start' }),
    ...(padding ? {} : { padding: 0 }),
  }

  const getMaxWidthClass = () => {
    return maxWidthClasses[maxWidth] || maxWidthClasses['2xl']
  }

  return (
    <div style={containerStyle} className={className}>
      <div className={`${styles.content.width} ${getMaxWidthClass()}`}>
        {children}
      </div>
    </div>
  )
}

export default PageWrapper
