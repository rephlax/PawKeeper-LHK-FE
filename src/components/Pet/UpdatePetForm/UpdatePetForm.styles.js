import { formStyles } from '../../Common/FormStyles'

export const styles = {
  ...formStyles,
  petImagePreview: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    '@media (max-width: 600px)': {
      gap: '0.25rem',
    },
  },
  previewImage: {
    width: '8rem',
    height: '8rem',
    borderRadius: '0.5rem',
    objectFit: 'cover',
    border: '3px solid #fde68a',
    '@media (max-width: 600px)': {
      width: '5rem',
      height: '5rem',
    },
  },
  previewText: {
    fontSize: '0.875rem',
    color: '#a8a29e',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  deleteSection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '2px solid #fde68a',
  },
  deleteWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
  },
  deleteText: {
    fontSize: '0.875rem',
    color: '#991b1b',
  },
}
