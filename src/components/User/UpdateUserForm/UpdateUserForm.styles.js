import { formStyles } from '../../Common/FormStyles'

export const styles = {
  ...formStyles,
  locationContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    gridColumn: 'span 2',
  },
  locationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    gridColumn: 'span 2',
  },
  profilePicturePreview: {
    marginTop: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  previewImage: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #fde68a',
  },
  previewText: {
    fontSize: '0.875rem',
    color: '#a8a29e',
  },
}