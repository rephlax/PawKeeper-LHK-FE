export const formStyles = {
  container: {
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
  },
  content: {
    base: {
      padding: '1.5rem',
    },
    large: {
      padding: '2rem',
    },
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  gridContainer: {
    base: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
    },
    medium: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  label: {
    display: 'block',
  },
  labelText: {
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  },
  textarea: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    minHeight: '6rem',
    resize: 'vertical',
  },
  select: {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },
  checkbox: {
    borderRadius: '0.25rem',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  fileContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  fileWrapper: {
    display: 'flex',
    gap: '0.75rem',
  },
  fileInput: {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
  },
  uploadButton: {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1.5rem',
  },
  submitButton: {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  secondaryButton: {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
  },
  errorMessage: {
    fontSize: '0.875rem',
    color: '#ef4444',
    marginTop: '0.25rem',
  },
  helperText: {
    fontSize: '0.75rem',
    color: '#a8a29e',
    marginTop: '0.25rem',
  },
}

// Form utility functions
export const handleInputFocus = e => {
  e.target.classList.remove('border-cream-300')
  e.target.classList.add('border-transparent', 'ring-2', 'ring-cream-400')
}

export const handleInputBlur = e => {
  e.target.classList.remove('border-transparent', 'ring-2', 'ring-cream-400')
  e.target.classList.add('border-cream-300')
}
