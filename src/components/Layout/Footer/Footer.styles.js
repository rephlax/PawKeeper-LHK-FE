export const styles = {
  footer: {
    container: {
      width: '100%',
      height: '2.5rem',
      borderTopWidth: '1px',
      borderTopStyle: 'solid',
    },
    innerContainer: {
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1rem',
      '@media (max-width: 640px)': {
        flexDirection: 'column',
        padding: '0.5rem 1rem',
        height: 'auto',
      },
    },
  },
  contact: {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      '@media (max-width: 640px)': {
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '0.5rem',
      },
    },
    label: {
      fontWeight: '500',
    },
    linksContainer: {
      display: 'flex',
      gap: '1rem',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'color 0.2s',
      textDecoration: 'none',
    },
    icon: {
      fontSize: '1.125rem',
    },
    emailText: {
      display: 'none',
      '@media (min-width: 640px)': {
        display: 'inline',
      },
    },
  },
  copyright: {
    text: {
      fontSize: '0.875rem',
      textAlign: 'center',
    },
    companyName: {
      fontWeight: '500',
    },
  },
}
