export const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    '@media (max-width: 600px)': {
      minHeight: '250px',
    },
  },
  map: {
    width: '100%',
    height: '100%',
    '@media (max-width: 600px)': {
      minHeight: '250px',
    },
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
    marginBottom: '1rem',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  errorMessage: {
    color: '#ef4444',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    backgroundColor: '#d6d3d1',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}

// Add keyframes for spinner
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleSheet)
