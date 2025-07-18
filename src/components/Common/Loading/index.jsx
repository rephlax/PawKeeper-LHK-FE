import React from 'react'
import { styles } from './Loading.styles'

const Loading = ({ text = 'Loading...', fullScreen = false }) => {
  const containerStyle = {
    ...styles.container,
    ...(fullScreen ? styles.fullScreen : {}),
  }

  return (
    <div style={containerStyle}>
      <svg
        style={styles.spinner}
        className='text-cream-600'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
          opacity='0.25'
        />
        <path
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
      {text && (
        <span style={styles.text} className='text-cream-700'>
          {text}
        </span>
      )}
    </div>
  )
}

export default Loading
