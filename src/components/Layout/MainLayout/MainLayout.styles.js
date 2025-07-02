export const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  backgroundEffects: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
  },
  backgroundBlob1: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: '24rem',
    height: '24rem',
    backgroundColor: 'rgba(214, 211, 209, 0.3)',
    borderRadius: '9999px',
    filter: 'blur(48px)',
    animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  },
  backgroundBlob2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: '24rem',
    height: '24rem',
    backgroundColor: 'rgba(214, 211, 209, 0.2)',
    borderRadius: '9999px',
    filter: 'blur(48px)',
    animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    animationDelay: '2s',
  },
  header: {
    position: 'sticky',
    top: 0,
    width: '100%',
    zIndex: 50,
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    zIndex: 10,
  },
  sidebar: {
    width: '16rem',
    backgroundColor: 'white',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    '@media (max-width: 768px)': {
      position: 'fixed',
      left: '-16rem',
      top: '5rem',
      bottom: '2.5rem',
      zIndex: 40,
      transition: 'left 0.3s',
    },
  },
  sidebarOpen: {
    left: 0,
  },
  mainArea: {
    flex: 1,
    backgroundColor: 'rgba(254, 252, 232, 0.8)',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 7.5rem)', // navbar (5rem) + footer (2.5rem)
  },
  footer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.05)',
    zIndex: 10,
  },
  chatWidget: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    zIndex: 50,
  },
}

// Add keyframes for pulse animation
const styleSheet = document.createElement('style')
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`
document.head.appendChild(styleSheet)
