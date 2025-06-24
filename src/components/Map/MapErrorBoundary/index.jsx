import React from 'react'

class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Map error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center h-full bg-cream-50'>
          <div className='text-center p-8 bg-white rounded-lg shadow-lg'>
            <h2 className='text-2xl font-bold text-cream-800 mb-4'>
              Oops! Something went wrong
            </h2>
            <p className='text-cream-600 mb-6'>
              We're having trouble loading the map. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-2 bg-cream-600 text-white rounded-md hover:bg-cream-700 transition-colors'
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default MapErrorBoundary
