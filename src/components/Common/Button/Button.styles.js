export const styles = {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none',
    '@media (max-width: 600px)': {
      padding: '0.375rem 0.75rem',
      fontSize: '0.95rem',
    },
  },
  variants: {
    primary: {
      backgroundColor: '#d6d3d1',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: '2px',
      borderStyle: 'solid',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  },
  sizes: {
    sm: {
      padding: '0.375rem 0.75rem',
      fontSize: '0.875rem',
      '@media (max-width: 600px)': {
        fontSize: '0.8rem',
      },
    },
    md: {
      padding: '0.5rem 1rem',
      fontSize: '1rem',
      '@media (max-width: 600px)': {
        fontSize: '0.95rem',
      },
    },
    lg: {
      padding: '0.75rem 1.5rem',
      fontSize: '1.125rem',
      '@media (max-width: 600px)': {
        fontSize: '1rem',
      },
    },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  fullWidth: {
    width: '100%',
  },
}
