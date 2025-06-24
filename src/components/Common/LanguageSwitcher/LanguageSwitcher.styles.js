export const styles = {
  container: {
    position: 'relative',
  },
  toggleButton: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  menu: {
    position: 'absolute',
    right: '0',
    marginTop: '0.5rem',
    width: '12rem',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
    zIndex: '50',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  menuContent: {
    padding: '0.25rem 0',
  },
  menuItem: {
    width: '100%',
    padding: '0.5rem 1rem',
    textAlign: 'left',
    transition: 'background-color 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
}
