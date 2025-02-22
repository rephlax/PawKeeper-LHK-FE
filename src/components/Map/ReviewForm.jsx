import React, { useState } from 'react'
import { Star } from 'lucide-react'
import axios from 'axios'
import { X } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const StarRating = ({ rating, setRating, disabled }) => {
  const [hover, setHover] = useState(0)

  // Star rating container
  const ratingContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  }

  // Star button
  const starButtonStyle = {
    padding: '0.25rem',
    transition: 'colors 0.2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? '0.5' : '1',
    background: 'transparent',
    border: 'none',
  }

  // Star icon
  const starIconStyle = {
    width: '1.5rem',
    height: '1.5rem',
    transition: 'colors 0.2s',
  }

  return (
    <div style={ratingContainerStyle}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type='button'
          disabled={disabled}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={starButtonStyle}
        >
          <Star
            style={starIconStyle}
            className={
              star <= (hover || rating)
                ? 'fill-cream-500 text-cream-500'
                : 'text-cream-300'
            }
          />
        </button>
      ))}
    </div>
  )
}

const ReviewForm = ({ onClose, targetUserId, sitterName }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
  })

  // Container
  const containerStyle = {
    height: '100%',
    overflowY: 'auto',
    padding: '1rem',
  }

  // Form
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Header container
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  // Title
  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
  }

  // Close button
  const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s',
  }

  // Close icon
  const closeIconStyle = {
    height: '1.25rem',
    width: '1.25rem',
  }

  // Close button hover
  const handleCloseButtonHover = e => {
    e.target.classList.remove('text-cream-600')
    e.target.classList.add('text-cream-800')
  }

  const handleCloseButtonLeave = e => {
    e.target.classList.remove('text-cream-800')
    e.target.classList.add('text-cream-600')
  }

  // Fields container
  const fieldsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  }

  // Field container
  const fieldContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
  }

  // Label
  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.25rem',
  }

  // Input
  const inputStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Input focus
  const handleInputFocus = e => {
    e.target.classList.remove('border-cream-300')
    e.target.classList.add('border-transparent', 'ring-2', 'ring-cream-400')
  }

  const handleInputBlur = e => {
    e.target.classList.remove('border-transparent', 'ring-2', 'ring-cream-400')
    e.target.classList.add('border-cream-300')
  }

  // Textarea extends input
  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  }

  // Actions container
  const actionsContainerStyle = {
    paddingTop: '1rem',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    display: 'flex',
    gap: '0.75rem',
  }

  // Cancel button
  const cancelButtonStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    opacity: isLoading ? '0.5' : '1',
  }

  // Cancel button hover
  const handleCancelButtonHover = e => {
    if (!isLoading) {
      e.target.classList.remove('bg-transparent')
      e.target.classList.add('bg-cream-50')
    }
  }

  const handleCancelButtonLeave = e => {
    if (!isLoading) {
      e.target.classList.remove('bg-cream-50')
      e.target.classList.add('bg-transparent')
    }
  }

  // Submit button
  const submitButtonStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
    cursor: isLoading ? 'not-allowed' : 'pointer',
  }

  // Submit button hover
  const handleSubmitButtonHover = e => {
    if (!isLoading) {
      e.target.classList.remove('bg-cream-600')
      e.target.classList.add('bg-cream-700')
    }
  }

  const handleSubmitButtonLeave = e => {
    if (!isLoading) {
      e.target.classList.remove('bg-cream-700')
      e.target.classList.add('bg-cream-600')
    }
  }

  // Loading overlay
  const loadingOverlayStyle = {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
  }

  // Loading spinner
  const spinnerStyle = {
    height: '2rem',
    width: '2rem',
    borderRadius: '9999px',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: 'transparent',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    animation: 'spin 1s linear infinite',
  }

  // Add spinner animation
  const spinKeyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `

  React.useEffect(() => {
    // Add the keyframes to the document
    const styleElement = document.createElement('style')
    styleElement.innerHTML = spinKeyframes
    document.head.appendChild(styleElement)

    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement)
    }
  }, [])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value,
    }))
  }

  const setRating = value => {
    setFormData(prev => ({
      ...prev,
      rating: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!formData.rating) {
      alert('Please select a rating')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(
        `${BACKEND_URL}/reviews/${targetUserId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        },
      )

      console.log('Review submitted:', response.data)
      onClose()
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle} className='text-cream-800'>
            Write a review for {sitterName}
          </h2>
          <button
            type='button'
            onClick={onClose}
            style={closeButtonStyle}
            className='text-cream-600'
            onMouseOver={handleCloseButtonHover}
            onMouseOut={handleCloseButtonLeave}
          >
            <X style={closeIconStyle} />
          </button>
        </div>

        <div style={fieldsContainerStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              Rating
            </label>
            <StarRating
              rating={formData.rating}
              setRating={setRating}
              disabled={isLoading}
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              Title
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              placeholder='Summarize your experience'
              style={inputStyle}
              className='border-cream-300 placeholder:text-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
              required
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              Review
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Share the details of your experience...'
              style={textareaStyle}
              className='border-cream-300 placeholder:text-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div style={actionsContainerStyle} className='border-cream-200'>
          <button
            type='button'
            onClick={onClose}
            style={cancelButtonStyle}
            className='border-cream-400 text-cream-700 bg-transparent'
            onMouseOver={handleCancelButtonHover}
            onMouseOut={handleCancelButtonLeave}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            style={submitButtonStyle}
            className={isLoading ? 'bg-cream-400' : 'bg-cream-600 text-white'}
            onMouseOver={handleSubmitButtonHover}
            onMouseOut={handleSubmitButtonLeave}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>

        {isLoading && (
          <div
            style={loadingOverlayStyle}
            className='bg-white/50 backdrop-blur-sm'
          >
            <div style={spinnerStyle} className='border-b-cream-600' />
          </div>
        )}
      </form>
    </div>
  )
}

export default ReviewForm
