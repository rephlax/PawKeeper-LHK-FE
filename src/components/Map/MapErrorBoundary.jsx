import React from 'react'
import { AlertTriangle } from 'lucide-react'

class MapErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    // Error container
    const errorContainerStyle = {
      padding: '1rem',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '0.5rem',
    }

    // Error content container
    const errorContentStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem',
    }

    // Icon
    const iconStyle = {
      width: '1.25rem',
      height: '1.25rem',
      flexShrink: '0',
      marginTop: '0.125rem',
    }

    // Error heading
    const headingStyle = {
      fontWeight: '500',
    }

    // Error message
    const messageStyle = {
      marginTop: '0.25rem',
    }

    if (this.state.hasError) {
      return (
        <div
          style={errorContainerStyle}
          className='bg-cream-50 border-cream-300'
        >
          <div style={errorContentStyle}>
            <AlertTriangle style={iconStyle} className='text-cream-600' />
            <div>
              <h3 style={headingStyle} className='text-cream-800'>
                Map Error
              </h3>
              <p style={messageStyle} className='text-cream-600'>
                Unable to load map. Please refresh the page.
              </p>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default MapErrorBoundary
