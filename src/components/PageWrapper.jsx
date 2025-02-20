import React from 'react'

const PageWrapper = ({ children, maxWidth = '3xl' }) => (
  <div className='w-full h-full flex items-center justify-center p-6'>
    <div
      className={`w-full ${
        maxWidth === 'sm'
          ? 'max-w-sm'
          : maxWidth === 'md'
            ? 'max-w-md'
            : maxWidth === 'lg'
              ? 'max-w-lg'
              : maxWidth === 'xl'
                ? 'max-w-xl'
                : 'max-w-2xl' // default
      }`}
    >
      {children}
    </div>
  </div>
)

export default PageWrapper
