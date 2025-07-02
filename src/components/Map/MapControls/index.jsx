import React, { useState } from 'react'
import { MapPin, X, Star } from 'lucide-react'
import { styles } from './MapControls.styles'

const MapControls = ({
  user,
  socket,
  isCreatingPin,
  setIsCreatingPin,
  isCreatingReview,
  setIsCreatingReview,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  userPin,
  selectedPin,
  startChat,
  map,
  isMapLoaded,
}) => {
  const [pinForm, setPinForm] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    rate: editData?.rate || '',
  })

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  })

  const handleCreatePin = () => {
    if (!user.location?.coordinates) {
      alert('Please set your location in your profile first')
      return
    }

    setIsCreatingPin(true)
    if (socket) {
      socket.emit('toggle_pin_creation', { isCreating: true })
    }
  }

  const handleSubmitPin = e => {
    e.preventDefault()

    if (socket) {
      const pinData = {
        ...pinForm,
        location: user.location,
      }

      if (isEditing && editData) {
        socket.emit('update_pin', { pinId: editData._id, ...pinData })
      } else {
        socket.emit('create_pin', pinData)
      }
    }
  }

  const handleSubmitReview = e => {
    e.preventDefault()

    if (socket && selectedPin) {
      socket.emit('create_review', {
        pinId: selectedPin._id,
        ...reviewForm,
      })
    }
  }

  const handleCancel = () => {
    setIsCreatingPin(false)
    setIsCreatingReview(false)
    setIsEditing(false)
    setEditData(null)
    if (socket) {
      socket.emit('toggle_pin_creation', { isCreating: false })
    }
  }

  // Show pin creation/edit form
  if (isCreatingPin || isEditing) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title} className='text-cream-800'>
            {isEditing ? 'Edit Pin' : 'Create Pin'}
          </h3>
          <button
            onClick={handleCancel}
            className='text-cream-600 hover:text-cream-800'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitPin} style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label} className='text-cream-700'>
              Title
            </label>
            <input
              type='text'
              value={pinForm.title}
              onChange={e => setPinForm({ ...pinForm, title: e.target.value })}
              style={styles.input}
              className='border-cream-300 focus:border-cream-500'
              placeholder='e.g., Experienced Pet Sitter'
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} className='text-cream-700'>
              Description
            </label>
            <textarea
              value={pinForm.description}
              onChange={e =>
                setPinForm({ ...pinForm, description: e.target.value })
              }
              style={styles.textarea}
              className='border-cream-300 focus:border-cream-500'
              placeholder='Tell pet owners about your services...'
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} className='text-cream-700'>
              Rate ($/hour)
            </label>
            <input
              type='number'
              value={pinForm.rate}
              onChange={e => setPinForm({ ...pinForm, rate: e.target.value })}
              style={styles.input}
              className='border-cream-300 focus:border-cream-500'
              placeholder='25'
              min='0'
              step='0.01'
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type='submit'
              style={styles.submitButton}
              className='bg-cream-600 text-white hover:bg-cream-700'
            >
              {isEditing ? 'Update Pin' : 'Create Pin'}
            </button>
            <button
              type='button'
              onClick={handleCancel}
              style={styles.cancelButton}
              className='border-cream-400 text-cream-700 hover:bg-cream-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Show review form
  if (isCreatingReview && selectedPin) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title} className='text-cream-800'>
            Review {selectedPin.user.username}
          </h3>
          <button
            onClick={handleCancel}
            className='text-cream-600 hover:text-cream-800'
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmitReview} style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label} className='text-cream-700'>
              Rating
            </label>
            <div className='flex gap-1'>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type='button'
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  className='text-2xl'
                >
                  <Star
                    size={24}
                    className={
                      star <= reviewForm.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} className='text-cream-700'>
              Comment
            </label>
            <textarea
              value={reviewForm.comment}
              onChange={e =>
                setReviewForm({ ...reviewForm, comment: e.target.value })
              }
              style={styles.textarea}
              className='border-cream-300 focus:border-cream-500'
              placeholder='Share your experience...'
              required
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type='submit'
              style={styles.submitButton}
              className='bg-cream-600 text-white hover:bg-cream-700'
            >
              Submit Review
            </button>
            <button
              type='button'
              onClick={handleCancel}
              style={styles.cancelButton}
              className='border-cream-400 text-cream-700 hover:bg-cream-50'
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Default view
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title} className='text-cream-800'>
          Map Controls
        </h3>
      </div>

      {user?.sitter && !userPin && (
        <button
          onClick={handleCreatePin}
          style={styles.mainButton}
          className='bg-cream-600 text-white hover:bg-cream-700'
          disabled={!isMapLoaded}
        >
          <MapPin size={20} />
          Create Your Pin
        </button>
      )}

      {selectedPin && (
        <div
          style={styles.selectedPinInfo}
          className='bg-cream-50 border border-cream-200'
        >
          <h4 style={styles.selectedPinTitle} className='text-cream-800'>
            {selectedPin.title || 'Pet Sitter'}
          </h4>
          <div style={styles.selectedPinDetails} className='text-cream-600'>
            <p>{selectedPin.user.username}</p>
            {selectedPin.rate && <p>${selectedPin.rate}/hour</p>}
            {selectedPin.user._id !== user?._id && (
              <div style={styles.buttonGroup}>
                <button
                  onClick={() => startChat(selectedPin.user._id)}
                  style={styles.secondaryButton}
                  className='border-cream-400 text-cream-700 hover:bg-cream-50'
                >
                  Chat
                </button>
                <button
                  onClick={() => setIsCreatingReview(true)}
                  style={styles.secondaryButton}
                  className='border-cream-400 text-cream-700 hover:bg-cream-50'
                >
                  Review
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MapControls
