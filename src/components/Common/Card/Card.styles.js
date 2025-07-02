export const styles = {
  card: {
    base: {
      borderRadius: '0.5rem',
      boxShadow:
        '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      transition: 'all 0.2s',
      '@media (max-width: 600px)': {
        borderRadius: '0.25rem',
      },
    },
    hoverable: {
      cursor: 'pointer',
    },
  },
  header: {
    padding: '1.5rem',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    '@media (max-width: 600px)': {
      padding: '0.75rem',
    },
  },
  body: {
    padding: '1.5rem',
    '@media (max-width: 600px)': {
      padding: '0.75rem',
    },
  },
  footer: {
    padding: '1.5rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    '@media (max-width: 600px)': {
      padding: '0.75rem',
    },
  },
}
