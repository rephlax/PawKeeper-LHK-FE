export const styles = {
  container: {
    flex: '1',
    overflowY: 'auto',
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  message: {
    container: isOwnMessage => ({
      display: 'flex',
      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
    }),
    bubble: {
      maxWidth: '70%',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    senderName: {
      fontSize: '0.75rem',
      opacity: '0.75',
      marginBottom: '0.25rem',
      fontWeight: '500',
    },
    content: {
      fontSize: '0.875rem',
      wordBreak: 'break-word',
      lineHeight: '1.5',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '0.5rem',
    },
    timestamp: {
      fontSize: '0.75rem',
      opacity: '0.75',
    },
  },
}
