import { formStyles } from '../../Common/FormStyles'

export const styles = {
  ...formStyles,
  passwordStrength: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
  },
  strengthBar: {
    width: '100%',
    height: '0.25rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '0.125rem',
    marginTop: '0.25rem',
    overflow: 'hidden',
  },
  strengthFill: strength => ({
    height: '100%',
    width: `${strength}%`,
    backgroundColor:
      strength < 33 ? '#ef4444' : strength < 66 ? '#f59e0b' : '#10b981',
    transition: 'width 0.3s, background-color 0.3s',
  }),
  requirements: {
    marginTop: '0.5rem',
    fontSize: '0.75rem',
    color: '#a8a29e',
  },
  requirementItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    marginTop: '0.25rem',
  },
  errorAlert: {
    padding: '0.75rem',
    borderRadius: '0.375rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  },
}
