import axios from 'axios'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from '../../Layout/PageWrapper'
import { Button, Loading } from '../../Common'
import { handleInputFocus, handleInputBlur } from '../../Common/FormStyles'
import { styles } from './AddPetForm.styles'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
const webToken = localStorage.getItem('authToken')

const SPECIES_OPTIONS = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'rabbit', label: 'Rabbit' },
  { value: 'hamster', label: 'Hamster' },
  { value: 'guinea_pig', label: 'Guinea Pig' },
  { value: 'fish', label: 'Fish' },
  { value: 'reptile', label: 'Reptile' },
  { value: 'other', label: 'Other' },
]

const AddPetForm = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const [formData, setFormData] = useState({
    petName: '',
    petAge: '',
    petSpecies: '',
    petPicture: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  async function handleCreatePet(e) {
    e.preventDefault()

    if (!formData.petName.trim()) {
      setError('Pet name is required')
      return
    }

    if (!formData.petSpecies) {
      setError('Please select a species')
      return
    }

    setSubmitting(true)
    setError('')

    if (webToken) {
      try {
        const newPet = {
          petName: formData.petName,
          petAge: formData.petAge || 0,
          petSpecies: formData.petSpecies,
          petPicture: formData.petPicture,
          owner: userId,
        }

        await axios.post(`${BACKEND_URL}/pets/${userId}`, newPet, {
          headers: {
            authorization: `Bearer ${webToken}`,
          },
        })

        alert('Pet Added Successfully!')
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.error('Error adding pet:', error)
        setError(
          error.response?.data?.message ||
            'Failed to add pet. Please try again.',
        )
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      setError('')
    }
  }

  const handleUpload = async () => {
    if (!imageFile) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', imageFile)
    formData.append('upload_preset', 'ml_default')

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzdrwiugn/image/upload',
        formData,
      )

      setFormData(prev => ({
        ...prev,
        petPicture: response.data.secure_url,
      }))
      setImageFile(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const contentStyle =
    window.innerWidth >= 640 ? styles.content.large : styles.content.base

  return (
    <PageWrapper maxWidth='md'>
      <div style={styles.container} className='bg-white border-cream-200'>
        <div style={contentStyle}>
          <h2 style={styles.title} className='text-cream-800'>
            {t('addpet.title')}
          </h2>

          {error && (
            <div className='p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
              {error}
            </div>
          )}

          <form style={styles.form} onSubmit={handleCreatePet}>
            <div style={styles.fieldsContainer}>
              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('addpet.name')} *
                </span>
                <input
                  type='text'
                  name='petName'
                  value={formData.petName}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder='e.g., Buddy'
                  required
                />
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <label style={styles.label}>
                  <span style={styles.labelText} className='text-cream-700'>
                    {t('addpet.age')}
                  </span>
                  <input
                    type='number'
                    name='petAge'
                    value={formData.petAge}
                    onChange={handleInputChange}
                    style={styles.input}
                    className='border-cream-300'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    min='0'
                    max='50'
                    placeholder='e.g., 3'
                  />
                </label>

                <label style={styles.label}>
                  <span style={styles.labelText} className='text-cream-700'>
                    {t('addpet.species')} *
                  </span>
                  <select
                    name='petSpecies'
                    value={formData.petSpecies}
                    onChange={handleInputChange}
                    style={styles.speciesSelect}
                    className='border-cream-300'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    required
                  >
                    <option value=''>Select species</option>
                    {SPECIES_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={styles.fileContainer}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('addpet.petpicture')}
                </span>
                <div style={styles.fileWrapper}>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    style={styles.fileInput}
                    className='border-cream-300 text-cream-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-cream-100 file:text-cream-700 hover:file:bg-cream-200'
                  />
                  <Button
                    type='button'
                    onClick={handleUpload}
                    disabled={uploading || !imageFile}
                    variant='secondary'
                    size='sm'
                  >
                    {uploading ? <Loading text='' /> : 'Upload'}
                  </Button>
                </div>

                {formData.petPicture && (
                  <div style={styles.petImagePreview}>
                    <img
                      src={formData.petPicture}
                      alt='Pet preview'
                      style={styles.previewImage}
                    />
                    <span style={styles.previewText}>Pet picture uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <Button type='submit' disabled={submitting} fullWidth>
                {submitting ? 'Adding Pet...' : t('addpet.addpet')}
              </Button>
              <Button
                as='a'
                href={`/users/user/${userId}`}
                variant='secondary'
                fullWidth
                onClick={e => {
                  e.preventDefault()
                  nav(`/users/user/${userId}`)
                }}
              >
                {t('addpet.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default AddPetForm
