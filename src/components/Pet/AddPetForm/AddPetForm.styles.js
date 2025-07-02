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
  speciesSelect: {
    ...formStyles.select,
  },
}
