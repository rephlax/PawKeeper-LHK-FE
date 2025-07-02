export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    '@media (max-width: 600px)': {
      gap: '0.25rem',
    },
  },
  pinItem: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '@media (max-width: 600px)': {
      padding: '0.5rem',
    },
  },
  pinHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  pinInfo: {
    flex: 1,
  },
  pinTitle: {
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '0.25rem',
    '@media (max-width: 600px)': {
      fontSize: '0.9rem',
    },
  },
  pinUsername: {
    fontSize: '0.875rem',
    marginBottom: '0.25rem',
  },
  pinRate: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  pinActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    padding: '0.375rem',
    borderRadius: '0.375rem',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  pinDescription: {
    fontSize: '0.875rem',
    marginBottom: '0.75rem',
  },
  pinStats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '2rem',
    color: '#a8a29e',
  },
}
