import React, { useState, useCallback, useEffect } from 'react'
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
  const { map, isMapLoaded } = useMap()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    services: initialData?.services || ['Dog Walking', 'Cat Sitting'],
    availability: initialData?.availability || 'Part Time',
    hourlyRate: initialData?.hourlyRate || 0,
  })

  useEffect(() => {
    if (isEditing && initialData && map && isMapLoaded) {
      map.flyTo({
        center: initialData.location.coordinates,
        zoom: 15,
        essential: true,
      })
    }
  }, [isEditing, initialData, map, isMapLoaded])

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json',
    },
  })

  const validateForm = () => {
    const errors = []

    if (!formData.title.trim()) {
      errors.push('Title is required')
    }
    if (!formData.description.trim()) {
      errors.push('Description is required')
    }
    if (!formData.services.length) {
      errors.push('At least one service must be selected')
    }
    if (formData.hourlyRate <= 0) {
      errors.push('Hourly rate must be greater than 0')
    }
    if (!map || !isMapLoaded) {
      errors.push('Map is not ready. Please try again.')
    }

    if (errors.length) {
      alert(errors.join('\n'))
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

  const handleSubmit = useCallback(async () => {
    if (!map || !isMapLoaded) {
      alert('Map is not ready. Please try again.')
      return
    }

    if (!validateForm()) return

    try {
      setIsLoading(true)
      const center = map.getCenter()

      if (!center) {
        console.error('Unable to get map center')
        return
      }

      const pinData = {
        longitude: center.lng,
        latitude: center.lat,
        title: formData.title,
        description: formData.description,
        services: formData.services,
        availability: formData.availability,
        hourlyRate: parseFloat(formData.hourlyRate),
        serviceRadius: 10,
      }

      console.log('Sending pin data:', pinData)

      const response = await axios.put(
        `${BACKEND_URL}/api/location-pins/${isEditing ? 'update' : 'create'}`,
        pinData,
        getAuthConfig(),
      )

      if (socket) {
        socket.emit(isEditing ? 'pin_updated' : 'pin_created', response.data)
        socket.emit('share_location', {
          lng: center.lng,
          lat: center.lat,
        })
      }

      onClose()
    } catch (error) {
      console.error('Pin submission error:', error)
      alert(error.response?.data?.message || 'Failed to save pin')
    } finally {
      setIsLoading(false)
    }
  }, [
    map,
    isMapLoaded,
    formData,
    isEditing,
    socket,
    getAuthConfig,
    validateForm,
  ])

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

      <div className='mt-4 space-y-2 p-4 bg-blue-50 rounded-lg'>
        <h3 className='font-medium text-blue-700'>Pin Location Instructions</h3>
        <ul className='list-disc pl-5 text-sm text-blue-600 space-y-1'>
          <li>Your pin will be placed at the center of the map</li>
          <li>Move the map to adjust the pin location before saving</li>
          <li>Use the zoom controls to get a precise location</li>
        </ul>
      </div>
    </div>
  )
}

export default PinForm
