import React, { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useMap } from '../../context/MapContext'
import axios from 'axios'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

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
    <div className='h-full overflow-y-auto p-4'>
      <div className='space-y-4'>
        {/* Form Header */}
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-cream-800'>
            {isEditing ? t(mapontrols.editpin) : t(mapontrols.createpin)}
          </h2>
          <button
            onClick={onClose}
            className='text-cream-600 hover:text-cream-800'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Form Fields */}
        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
            {t(lables.title)}
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 text-sm border border-cream-300 rounded-md
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400'
              placeholder={`${user?.username}'s Pet Sitting Location`}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
            {t(lables.description)}
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 text-sm border border-cream-300 rounded-md
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 placeholder:text-cream-400
                       min-h-[80px] max-h-[120px] resize-y'
              placeholder='Describe your services...'
              disabled={isLoading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
            {t(lables.services)}
            </label>
            <select
              name='services'
              multiple
              value={formData.services}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 text-sm border border-cream-300 rounded-md
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200 h-24'
              disabled={isLoading}
            >
              <option value='Dog Walking'>{t(services.dogWalking)}</option>
              <option value='Cat Sitting'>{t(services.catSitting)}</option>
              <option value='Pet Boarding'>{t(services.petBoarding)}</option>
              <option value='Pet Grooming'>{t(services.petGrooming)}</option>
              <option value='Dog Training'>{t(services.dogTraining)}</option>
            </select>
            <p className='mt-1 text-xs text-cream-600'>
            {t(instructions.controlKeyNotice)}
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
            {t(lables.availability)}
            </label>
            <select
              name='availability'
              value={formData.availability}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 text-sm border border-cream-300 rounded-md
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
              disabled={isLoading}
            >
              <option value='Full Time'>{t(services.fullTime)}</option>
              <option value='Part Time'>{t(services.partTime)}</option>
              <option value='Weekends Only'>{t(services.weekendsOnly)}</option>
            </select>
          </div>

          <div>
            <label className='block text-sm font-medium text-cream-700 mb-1'>
            {t(lables.hourlyRate)} ($)
            </label>
            <input
              type='number'
              name='hourlyRate'
              value={formData.hourlyRate}
              onChange={handleInputChange}
              className='w-full px-3 py-1.5 text-sm border border-cream-300 rounded-md
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
              min='0'
              step='0.01'
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className='bg-cream-50 rounded-md p-3 border border-cream-200 text-sm'>
          <h3 className='font-medium text-cream-800 mb-1'>
          {t(instructions.pinLocationInstructions)}
          </h3>
          <ul className='list-disc list-inside text-xs text-cream-700 space-y-0.5'>
            <li>{t(pinInstructions.pinPlaced)}</li>
            <li>{t(instructions.moveMapTip)}</li>
            <li>{t(instructions.zoomTip)}</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className='flex gap-2 pt-2'>
          <button
            onClick={onClose}
            className='flex-1 px-3 py-1.5 text-sm border-2 border-cream-400 text-cream-700 
                     rounded-md hover:bg-cream-50 transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='flex-1 px-3 py-1.5 text-sm bg-cream-600 text-white rounded-md 
                     hover:bg-cream-700 transition-colors duration-200
                     disabled:bg-cream-400 disabled:cursor-not-allowed'
          >
            {isLoading
              ? t('buttons.processing')
              : isEditing
                ? t('buttons.updatePin')
                : t('buttons.createPin')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PinForm
