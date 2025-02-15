import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useMap } from '../../context/MapContext'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const PinForm = ({
  onClose,
  isEditing = false,
  initialData = null,
  containerClass = '',
}) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const { map } = useMap()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    services: initialData?.services || ['Dog Walking', 'Cat Sitting'],
    availability: initialData?.availability || 'Part Time',
    hourlyRate: initialData?.hourlyRate || 0,
  })

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    },
  })

  const validateForm = () => {
    if (!formData.title.trim()) {
      alert('Title is required')
      return false
    }
    if (!formData.description.trim()) {
      alert('Description is required')
      return false
    }
    if (formData.hourlyRate <= 0) {
      alert('Please enter a valid hourly rate')
      return false
    }
    return true
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return

      setIsLoading(true)

      // Get current map center for pin location
      const center = map.current.getCenter()
      const location = {
        lng: center.lng,
        lat: center.lat,
      }

      const pinData = {
        longitude: location.lng,
        latitude: location.lat,
        title: formData.title,
        description: formData.description,
        services: formData.services,
        availability: formData.availability,
        hourlyRate: parseFloat(formData.hourlyRate),
        serviceRadius: 10,
      }

      let response
      if (isEditing) {
        response = await axios.put(
          `${BACKEND_URL}/api/location-pins/update`,
          { ...pinData, id: initialData._id },
          getAuthConfig(),
        )
      } else {
        response = await axios.post(
          `${BACKEND_URL}/api/location-pins/create`,
          pinData,
          getAuthConfig(),
        )
      }

      if (socket) {
        socket.emit(isEditing ? 'pin_updated' : 'pin_created', response.data)
        socket.emit('share_location', location)
      }

      onClose()
    } catch (error) {
      console.error('Error with pin operation:', error)
      alert(
        error.response?.data?.message ||
          `Failed to ${isEditing ? 'update' : 'create'} pin. Please try again.`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`space-y-4 ${containerClass}`}>
      <div>
        <label className='block text-sm font-medium mb-1'>Title</label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={handleInputChange}
          className='w-full p-2 border rounded'
          placeholder={`${user?.username}'s Pet Sitting Location`}
          disabled={isLoading}
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <textarea
          name='description'
          value={formData.description}
          onChange={handleInputChange}
          className='w-full p-2 border rounded'
          rows='3'
          placeholder='Describe your services...'
          disabled={isLoading}
        />
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Services</label>
        <select
          name='services'
          multiple
          value={formData.services}
          onChange={handleInputChange}
          className='w-full p-2 border rounded'
          disabled={isLoading}
        >
          <option value='Dog Walking'>Dog Walking</option>
          <option value='Cat Sitting'>Cat Sitting</option>
          <option value='Pet Boarding'>Pet Boarding</option>
          <option value='Pet Grooming'>Pet Grooming</option>
          <option value='Dog Training'>Dog Training</option>
        </select>
        <p className='text-sm text-gray-500 mt-1'>
          Hold Ctrl/Cmd to select multiple services
        </p>
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>Availability</label>
        <select
          name='availability'
          value={formData.availability}
          onChange={handleInputChange}
          className='w-full p-2 border rounded'
          disabled={isLoading}
        >
          <option value='Full Time'>Full Time</option>
          <option value='Part Time'>Part Time</option>
          <option value='Weekends Only'>Weekends Only</option>
        </select>
      </div>

      <div>
        <label className='block text-sm font-medium mb-1'>
          Hourly Rate ($)
        </label>
        <input
          type='number'
          name='hourlyRate'
          value={formData.hourlyRate}
          onChange={handleInputChange}
          className='w-full p-2 border rounded'
          min='0'
          step='0.01'
          disabled={isLoading}
        />
      </div>

      <div className='pt-4 flex gap-3'>
        <button
          onClick={onClose}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`flex-1 px-4 py-2 text-white rounded
            ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isLoading
            ? 'Processing...'
            : isEditing
              ? 'Update Pin'
              : 'Create Pin'}
        </button>
      </div>

      <div className='mt-4 text-sm text-gray-500'>
        <p>📍 Pin will be placed at the current map center</p>
        <p>🔍 Drag the map to adjust the pin location before saving</p>
      </div>
    </div>
  )
}

export default PinForm
