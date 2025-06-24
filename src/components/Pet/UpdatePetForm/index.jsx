import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from '../../Layout/PageWrapper'
import { useTranslation } from 'react-i18next'
import { Button, Loading } from '../../Common'
import { handleInputFocus, handleInputBlur } from '../../Common/FormStyles'
import { styles } from './UpdatePetForm.styles'
import { AlertTriangle } from 'lucide-react'

const webToken = localStorage.getItem('authToken')
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

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

const UpdatePet = () => {
  const { t } = useTranslation()
  const { userId, petId } = useParams()
  const [formData, setFormData] = useState({
    petName: '',
    petAge: '',
    petSpecies: '',
    petPicture: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    async function getOnePet() {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/pets/${userId}/${petId}`,
          {
            headers: { authorization: `Bearer ${webToken}` },
          },
        )

        const pet = response.data
        setFormData({
          petName: pet.petName || '',
          petAge: pet.petAge || '',
          petSpecies: pet.petSpecies || '',
          petPicture: pet.petPicture || '',
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching pet:', error)
        setError('Failed to load pet data')
        setLoading(false)
      }
    }

    getOnePet()
  }, [userId, petId])

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  async function handleUpdatePet(e) {
    e.preventDefault()

    if (!formData.petName.trim()) {
      setError('Pet name is required')
      return
    }

    setSubmitting(true)
    setError('')

    const updatedPet = {
      petName: formData.petName,
      petAge: formData.petAge,
      petSpecies: formData.petSpecies,
      petPicture: formData.petPicture,
    }

    try {
      await axios.patch(`${BACKEND_URL}/pets/${petId}`, updatedPet, {
        headers: { authorization: `Bearer ${webToken}` },
      })

      alert('Pet Updated Successfully!')
      nav(`/users/user/${userId}`)
    } catch (error) {
      console.error('Error updating pet:', error)
      setError(
        error.response?.data?.message ||
          'Failed to update pet. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePet = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete this pet? This action cannot be undone.',
      )
    ) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      await axios.delete(`${BACKEND_URL}/pets/${petId}`, {
        headers: { authorization: `Bearer ${webToken}` },
      })

      alert('Pet deleted successfully')
      nav(`/users/user/${userId}`)
    } catch (error) {
      console.error('Error deleting pet:', error)
      setError('Failed to delete pet. Please try again.')
      setDeleting(false)
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

  if (loading) {
    return (
      <PageWrapper maxWidth='md'>
        <div style={styles.loadingContainer}>
          <Loading text='Loading pet data...' />
        </div>
      </PageWrapper>
    )
  }

  const contentStyle =
    window.innerWidth >= 640 ? styles.content.large : styles.content.base

  return (
    <PageWrapper maxWidth='md'>
      <div style={styles.container} className='bg-white border-cream-200'>
        <div style={contentStyle}>
          <h2 style={styles.title} className='text-cream-800'>
            {t('userpage.pets.update')}
          </h2>

          {error && (
            <div className='p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
              {error}
            </div>
          )}

          <form style={styles.form} onSubmit={handleUpdatePet}>
            <div style={styles.fieldsContainer}>
              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('userpage.pets.name')} *
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
                  required
                />
              </label>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <label style={styles.label}>
                  <span style={styles.labelText} className='text-cream-700'>
                    {t('userpage.pets.age')}
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
                  />
                </label>

                <label style={styles.label}>
                  <span style={styles.labelText} className='text-cream-700'>
                    {t('userpage.pets.species')}
                  </span>
                  <select
                    name='petSpecies'
                    value={formData.petSpecies}
                    onChange={handleInputChange}
                    style={styles.select}
                    className='border-cream-300'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
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
                  {t('userpage.pets.picture')}
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
                      alt={`${formData.petName} preview`}
                      style={styles.previewImage}
                    />
                    <span style={styles.previewText}>Current pet picture</span>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.buttonContainer}>
              <Button type='submit' disabled={submitting} fullWidth>
                {submitting ? 'Updating Pet...' : t('userpage.pets.update')}
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
                {t('userpage.pets.cancel')}
              </Button>
            </div>
          </form>

          {/* Delete Section */}
          <div style={styles.deleteSection}>
            <div style={styles.deleteWarning}>
              <AlertTriangle size={20} className='text-red-600' />
              <span style={styles.deleteText}>
                Deleting this pet will permanently remove all associated data.
              </span>
            </div>
            <Button
              onClick={handleDeletePet}
              disabled={deleting}
              variant='secondary'
              fullWidth
              className='border-red-400 text-red-700 hover:bg-red-50'
            >
              {deleting ? 'Deleting...' : 'Delete Pet'}
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default UpdatePet
