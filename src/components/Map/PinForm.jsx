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
    console.log(initialData)
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

      const response = await axios[isEditing ? 'put' : 'post'](
        `${BACKEND_URL}/api/location-pins/${isEditing ? 'update' : 'create'}`,
        pinData,
        getAuthConfig(),
      )

      if (socket) {
        socket.emit(isEditing ? 'user_pin_updated' : 'user_pin_created', {
          pin: response.data,
          userId: user._id,
        })
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
    <div className={`space-y-6 ${containerClass}`}>
      <div className='border-b border-cream-200 pb-6'>
        <div className='flex flex-col space-y-4'>
          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Title
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400'
              placeholder={`${user?.username}'s Pet Sitting Location`}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Description
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400
                       min-h-[100px] resize-y'
              placeholder='Describe your services...'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Services
            </label>
            <select
              name='services'
              multiple
              value={formData.services}
              onChange={handleInputChange}
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 min-h-[120px]'
              disabled={isLoading}
            >
              <option value='Dog Walking'>Dog Walking</option>
              <option value='Cat Sitting'>Cat Sitting</option>
              <option value='Pet Boarding'>Pet Boarding</option>
              <option value='Pet Grooming'>Pet Grooming</option>
              <option value='Dog Training'>Dog Training</option>
            </select>
            <p className='mt-1 text-sm text-cream-600'>
              Hold Ctrl/Cmd to select multiple services
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Availability
            </label>
            <select
              name='availability'
              value={formData.availability}
              onChange={handleInputChange}
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
              disabled={isLoading}
            >
              <option value='Full Time'>Full Time</option>
              <option value='Part Time'>Part Time</option>
              <option value='Weekends Only'>Weekends Only</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
              Hourly Rate ($)
            </label>
            <input
              type='number'
              name='hourlyRate'
              value={formData.hourlyRate}
              onChange={handleInputChange}
              className='w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
              min='0'
              step='0.01'
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col space-y-4'>
        <div className='bg-cream-50 rounded-lg p-4 border border-cream-200'>
          <h3 className='font-medium text-cream-800 mb-2'>
            Pin Location Instructions
          </h3>
          <ul className='list-disc list-inside text-sm text-cream-700 space-y-1'>
            <li>Your pin will be placed at the center of the map</li>
            <li>Move the map to adjust the pin location before saving</li>
            <li>Use the zoom controls to get a precise location</li>
          </ul>
        </div>

        <div className='flex gap-3 pt-4'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 border-2 border-cream-400 text-cream-700 
                     rounded-lg hover:bg-cream-50 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='flex-1 px-4 py-2 bg-cream-600 text-white rounded-lg 
                     hover:bg-cream-700 transition-colors duration-200
                     disabled:bg-cream-400 disabled:cursor-not-allowed'
          >
            {isLoading
              ? 'Processing...'
              : isEditing
                ? 'Update Pin'
                : 'Create Pin'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PinForm
