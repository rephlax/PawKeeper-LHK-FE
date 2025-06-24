export const styles = {
  navbar: {
    container: {
      width: '100%',
      height: '5rem',
      borderBottomWidth: '1px',
      borderBottomStyle: 'solid',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(4px)',
    },
    innerContainer: {
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 1rem',
    },
  },
  logo: {
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    image: {
      width: '20%',
      height: '20%',
      objectFit: 'contain',
      transition: 'transform 0.3s',
    },
  },
  navigation: {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    link: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
    },
    langSwitcher: {
      marginLeft: '1rem',
      paddingLeft: '1rem',
      borderLeftWidth: '1px',
      borderLeftStyle: 'solid',
    },
  },
  mapIcon: {
    height: '2rem',
    width: '2rem',
  },
  mobileMenu: {
    button: {
      display: 'none',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      '@media (max-width: 768px)': {
        display: 'block',
      },
    },
    overlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 40,
    },
    menu: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '16rem',
      backgroundColor: 'white',
      zIndex: 50,
      transform: 'translateX(100%)',
      transition: 'transform 0.3s',
      boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
    },
    menuOpen: {
      transform: 'translateX(0)',
    },
    menuContent: {
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    closeButton: {
      alignSelf: 'flex-end',
      padding: '0.5rem',
      marginBottom: '1rem',
    },
  },
}
