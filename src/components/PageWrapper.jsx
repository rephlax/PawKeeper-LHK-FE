import React from 'react'

const PageWrapper = ({ children }) => (
  <div className='flex min-h-screen bg-cream-50/50'>
    <div className='flex-1 flex flex-col justify-center items-center py-12 px-4'>
      <div className='w-full max-w-3xl mx-auto'>{children}</div>
    </div>
  </div>
)

export default PageWrapper
