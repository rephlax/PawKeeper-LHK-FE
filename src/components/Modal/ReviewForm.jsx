import React, { useState } from 'react'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

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

  const handleSubmit = async e => {
    e.preventDefault()
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
    <div className={`space-y-4`}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Title</label>
          <input
            type='text'
            name='title'
            value={formData.title}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
            placeholder={`Review for ${sitterName}`}
            disabled={isLoading}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Rating</label>
          <select
            name='rating'
            value={formData.rating}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
            disabled={isLoading}
            required
          >
            <option value=''>Select Rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium mb-1'>Review</label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            className='w-full p-2 border rounded'
            rows='4'
            placeholder='Write your review...'
            disabled={isLoading}
            required
          />
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            type='button'
            onClick={onClose}
            className={`flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isLoading}
            className={`flex-1 px-4 py-2 text-white rounded ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
