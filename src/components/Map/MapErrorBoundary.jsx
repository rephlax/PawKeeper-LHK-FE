import React from 'react'

class MapErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4 bg-red-50 border border-red-200 rounded'>
          <h3 className='text-red-800 font-medium'>Map Error</h3>
          <p className='text-red-600'>
            Unable to load map. Please refresh the page.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

export default MapErrorBoundary
