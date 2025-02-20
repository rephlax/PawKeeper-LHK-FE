import React, { useState } from 'react'
import { Star } from 'lucide-react'
import axios from 'axios'
import { X } from 'lucide-react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const StarRating = ({ rating, setRating, disabled }) => {
  const [hover, setHover] = useState(0)

  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type='button'
          disabled={disabled}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`
            p-1 transition-colors duration-200
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
          `}
        >
          <Star
            className={`w-6 h-6 transition-colors duration-200 
              ${
                star <= (hover || rating)
                  ? 'fill-cream-500 text-cream-500'
                  : 'text-cream-300'
              }`}
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
    <div className='h-full overflow-y-auto p-4'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold text-cream-800'>
            Write a review for {sitterName}
          </h2>
          <button
            type='button'
            onClick={onClose}
            className='text-cream-600 hover:text-cream-800'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Rating
            </label>
            <StarRating
              rating={formData.rating}
              setRating={setRating}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Title
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              placeholder='Summarize your experience'
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400'
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Review
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder='Share the details of your experience...'
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400
                       min-h-[120px] resize-y'
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className='pt-4 border-t border-cream-200'>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border-2 border-cream-400 text-cream-700 
                       rounded-lg hover:bg-cream-50 transition-colors duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 px-4 py-2 bg-cream-600 text-white rounded-lg 
                       hover:bg-cream-700 transition-colors duration-200
                       disabled:bg-cream-400 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>

        {isLoading && (
          <div
            className='absolute inset-0 bg-white/50 backdrop-blur-sm 
                        flex items-center justify-center rounded-lg'
          >
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-cream-600' />
          </div>
        )}
      </form>
    </div>
  )
}

export default ReviewForm
