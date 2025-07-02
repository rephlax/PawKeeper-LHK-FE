export const styles = {
  widget: {
    container: {
      position: 'fixed',
      bottom: '3.5rem',
      right: '1rem',
      zIndex: '50',
      maxHeight: '600px',
    },
    button: {
      padding: '0.75rem',
      borderRadius: '9999px',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '3.5rem',
      height: '3.5rem',
      transform: 'scale(1)',
      transition: 'all 0.2s',
    },
  },
  window: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      width: '320px',
      height: '480px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '0.75rem',
      boxShadow:
        '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    header: {
      padding: '0.75rem 1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
    },
    headerTitle: {
      fontWeight: '500',
    },
    headerButtons: {
      display: 'flex',
      gap: '0.5rem',
    },
  },
  content: {
    area: {
      flex: '1',
      overflowY: 'auto',
    },
    activeChat: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    messagesContainer: {
      flex: '1',
      overflowY: 'auto',
    },
    inputContainer: {
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
    },
  },
  iconButton: {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'background-color 0.2s',
  },
}
