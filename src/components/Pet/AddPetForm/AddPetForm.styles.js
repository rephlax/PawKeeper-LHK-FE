import { formStyles } from '../../Common/FormStyles'

export const styles = {
  ...formStyles,
  petImagePreview: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  previewImage: {
    width: '8rem',
    height: '8rem',
    borderRadius: '0.5rem',
    objectFit: 'cover',
    border: '3px solid #fde68a',
  },
  previewText: {
    fontSize: '0.875rem',
    color: '#a8a29e',
  },
  speciesSelect: {
    ...formStyles.select,
  },
}
