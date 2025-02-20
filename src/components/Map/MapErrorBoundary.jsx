import React from 'react'
import { AlertTriangle } from 'lucide-react'

class MapErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='p-4 bg-cream-50 border border-cream-300 rounded-lg'>
          <div className='flex items-start gap-2'>
            <AlertTriangle className='w-5 h-5 text-cream-600 flex-shrink-0 mt-0.5' />
            <div>
              <h3 className='text-cream-800 font-medium'>Map Error</h3>
              <p className='text-cream-600 mt-1'>
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
