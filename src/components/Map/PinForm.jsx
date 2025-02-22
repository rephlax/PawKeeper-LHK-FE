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

  // Define translation keys
  const labels = {
    title: 'pinform.title',
    description: 'pinform.description',
    services: 'pinform.services',
    availability: 'pinform.availability',
    hourlyRate: 'pinform.hourlyRate',
  }

  const services = {
    dogWalking: 'services.dogWalking',
    catSitting: 'services.catSitting',
    petBoarding: 'services.petBoarding',
    petGrooming: 'services.petGrooming',
    dogTraining: 'services.dogTraining',
    fullTime: 'availability.fullTime',
    partTime: 'availability.partTime',
    weekendsOnly: 'availability.weekendsOnly',
  }

  const instructions = {
    controlKeyNotice: 'pinform.controlKeyNotice',
    pinLocationInstructions: 'pinform.pinLocationInstructions',
    moveMapTip: 'pinform.moveMapTip',
    zoomTip: 'pinform.zoomTip',
  }

  const pinInstructions = {
    pinPlaced: 'pinform.pinPlaced',
  }

  const buttons = {
    processing: 'buttons.processing',
    updatePin: 'buttons.updatePin',
    createPin: 'buttons.createPin',
  }

  // Container
  const containerStyle = {
    height: '100%',
    overflowY: 'auto',
    padding: '1rem',
  }

  // Form content container
  const formContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Header container
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  }

  // Title
  const titleStyle = {
    fontSize: '1.125rem',
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

  // Close button hover
  const handleCloseButtonHover = e => {
    e.target.classList.remove('text-cream-600')
    e.target.classList.add('text-cream-800')
  }

  const handleCloseButtonLeave = e => {
    e.target.classList.remove('text-cream-800')
    e.target.classList.add('text-cream-600')
  }

  // Close icon
  const closeIconStyle = {
    height: '1.25rem',
    width: '1.25rem',
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
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
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

  // Textarea
  const textareaStyle = {
    ...inputStyle,
    minHeight: '80px',
    maxHeight: '120px',
    resize: 'vertical',
  }

  // Select extends input
  const selectStyle = {
    ...inputStyle,
  }

  // Multiple select extends select
  const multipleSelectStyle = {
    ...selectStyle,
    height: '6rem', // h-24
  }

  // Helper text
  const helperTextStyle = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
  }

  // Instructions container
  const instructionsContainerStyle = {
    borderRadius: '0.375rem',
    padding: '0.75rem',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Instructions title
  const instructionsTitleStyle = {
    fontWeight: '500',
    marginBottom: '0.25rem',
  }

  // Instructions list
  const instructionsListStyle = {
    listStyleType: 'disc',
    listStylePosition: 'inside',
    fontSize: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  }

  // Buttons container
  const buttonsContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
    paddingTop: '0.5rem',
  }

  // Cancel button
  const cancelButtonStyle = {
    flex: '1',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.375rem',
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
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    borderRadius: '0.375rem',
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
    const { name, value, options } = e.target

    if (name === 'services' && options) {
      const selectedServices = []
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedServices.push(options[i].value)
        }
      }
      setFormData(prev => ({
        ...prev,
        [name]: selectedServices,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value,
      }))
    }
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
    user,
    onClose,
    validateForm,
  ])

  return (
    <div style={containerStyle}>
      <div style={formContentStyle}>
        {/* Form Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle} className='text-cream-800'>
            {isEditing ? t('mapcontrols.editpin') : t('mapcontrols.createpin')}
          </h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            className='text-cream-600'
            onMouseOver={handleCloseButtonHover}
            onMouseOut={handleCloseButtonLeave}
          >
            <X style={closeIconStyle} />
          </button>
        </div>

        {/* Form Fields */}
        <div style={fieldsContainerStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              {t(labels.title)}
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleInputChange}
              style={inputStyle}
              className='border-cream-300 placeholder:text-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={`${user?.username}'s Pet Sitting Location`}
              disabled={isLoading}
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              {t(labels.description)}
            </label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              style={textareaStyle}
              className='border-cream-300 placeholder:text-cream-400'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder='Describe your services...'
              disabled={isLoading}
            />
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              {t(labels.services)}
            </label>
            <select
              name='services'
              multiple
              value={formData.services}
              onChange={handleInputChange}
              style={multipleSelectStyle}
              className='border-cream-300'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
            >
              <option value='Dog Walking'>{t(services.dogWalking)}</option>
              <option value='Cat Sitting'>{t(services.catSitting)}</option>
              <option value='Pet Boarding'>{t(services.petBoarding)}</option>
              <option value='Pet Grooming'>{t(services.petGrooming)}</option>
              <option value='Dog Training'>{t(services.dogTraining)}</option>
            </select>
            <p style={helperTextStyle} className='text-cream-600'>
              {t(instructions.controlKeyNotice)}
            </p>
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              {t(labels.availability)}
            </label>
            <select
              name='availability'
              value={formData.availability}
              onChange={handleInputChange}
              style={selectStyle}
              className='border-cream-300'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              disabled={isLoading}
            >
              <option value='Full Time'>{t(services.fullTime)}</option>
              <option value='Part Time'>{t(services.partTime)}</option>
              <option value='Weekends Only'>{t(services.weekendsOnly)}</option>
            </select>
          </div>

          <div style={fieldContainerStyle}>
            <label style={labelStyle} className='text-cream-700'>
              {t(labels.hourlyRate)} ($)
            </label>
            <input
              type='number'
              name='hourlyRate'
              value={formData.hourlyRate}
              onChange={handleInputChange}
              style={inputStyle}
              className='border-cream-300'
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              min='0'
              step='0.01'
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Instructions */}
        <div
          style={instructionsContainerStyle}
          className='bg-cream-50 border-cream-200'
        >
          <h3 style={instructionsTitleStyle} className='text-cream-800'>
            {t(instructions.pinLocationInstructions)}
          </h3>
          <ul style={instructionsListStyle} className='text-cream-700'>
            <li>{t(pinInstructions.pinPlaced)}</li>
            <li>{t(instructions.moveMapTip)}</li>
            <li>{t(instructions.zoomTip)}</li>
          </ul>
        </div>

        {/* Buttons */}
        <div style={buttonsContainerStyle}>
          <button
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
            onClick={handleSubmit}
            disabled={isLoading}
            style={submitButtonStyle}
            className={isLoading ? 'bg-cream-400' : 'bg-cream-600 text-white'}
            onMouseOver={handleSubmitButtonHover}
            onMouseOut={handleSubmitButtonLeave}
          >
            {isLoading
              ? t(buttons.processing)
              : isEditing
                ? t(buttons.updatePin)
                : t(buttons.createPin)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PinForm
