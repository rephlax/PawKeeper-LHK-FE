export const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  spinner: {
    width: '2.5rem',
    height: '2.5rem',
    animation: 'spin 1s linear infinite',
  },
  text: {
    marginLeft: '1rem',
    fontSize: '1rem',
  },
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 50,
  },
}
