import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from '../../Layout/PageWrapper'
import { Button, Loading } from '../../Common'
import { handleInputFocus, handleInputBlur } from '../../Common/FormStyles'
import { styles } from './UpdateUserForm.styles'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UpdateUserForm = () => {
  const { t } = useTranslation()
  const { user, userId } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profilePicture: '',
    rate: '',
    latitude: '',
    longitude: '',
    sitter: false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const nav = useNavigate()
  const webToken = localStorage.getItem('authToken')

  useEffect(() => {
    async function getOneUser() {
      if (webToken) {
        try {
          const response = await axios.get(
            `${BACKEND_URL}/users/user/${userId}`,
            {
              headers: {
                authorization: `Bearer ${webToken}`,
              },
            },
          )
          const userData = response.data
          setFormData({
            username: userData.username || '',
            email: userData.email || '',
            profilePicture: userData.profilePicture || '',
            rate: userData.rate || '',
            latitude: userData.location?.coordinates.latitude || 0,
            longitude: userData.location?.coordinates.longitude || 0,
            sitter: userData.sitter || false,
          })
          setLoading(false)
        } catch (error) {
          console.error('Error fetching user:', error)
          setLoading(false)
        }
      }
    }
    getOneUser()
  }, [userId, webToken])

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleUpdateUser(e) {
    e.preventDefault()
    setSubmitting(true)

    const updatedUser = {
      username: formData.username,
      email: formData.email,
      profilePicture: formData.profilePicture,
      rate: formData.rate,
      location: {
        coordinates: {
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
      },
      sitter: formData.sitter,
    }

    if (webToken) {
      try {
        await axios.patch(
          `${BACKEND_URL}/users/update-user/${userId}`,
          updatedUser,
          {
            headers: { authorization: `Bearer ${webToken}` },
          },
        )

        alert('User Updated!')
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.error('Error updating user:', error)
        alert('Failed to update user. Please try again.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleImageChange = e => {
    setImageFile(e.target.files[0])
  }

  const handleUpload = async () => {
    if (!imageFile) return

    setUploading(true)

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
        profilePicture: response.data.secure_url,
      }))
      setImageFile(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper maxWidth='md'>
        <Loading text='Loading user data...' />
      </PageWrapper>
    )
  }

  const contentStyle =
    window.innerWidth >= 640 ? styles.content.large : styles.content.base
  const gridStyle =
    window.innerWidth >= 768
      ? { ...styles.gridContainer.base, ...styles.gridContainer.medium }
      : styles.gridContainer.base

  return (
    <PageWrapper maxWidth='md'>
      <div style={styles.container} className='bg-white border-cream-200'>
        <div style={contentStyle}>
          <h2 style={styles.title} className='text-cream-800'>
            {t('userupdate.title')}
          </h2>

          <form style={styles.form} onSubmit={handleUpdateUser}>
            <div style={gridStyle}>
              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('forms.emailLabel')}
                </span>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </label>

              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('signuppage.usernameLabel')}
                </span>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </label>

              <div style={styles.fileContainer} className='md:col-span-2'>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('userupdate.profilePictureLabel')}
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
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                {formData.profilePicture && (
                  <div style={styles.profilePicturePreview}>
                    <img
                      src={formData.profilePicture}
                      alt='Profile preview'
                      style={styles.previewImage}
                    />
                    <span style={styles.previewText}>
                      Current profile picture
                    </span>
                  </div>
                )}
              </div>

              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('signuppage.rateLabel')}
                </span>
                <input
                  type='number'
                  name='rate'
                  value={formData.rate}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  min='0'
                  step='0.01'
                  placeholder='25.00'
                />
              </label>

              <div style={styles.locationContainer}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('signuppage.locationLabel')}
                </span>
                <div style={styles.locationGrid}>
                  <input
                    type='number'
                    name='latitude'
                    placeholder={t('signuppage.latitudePlaceholder')}
                    value={formData.latitude}
                    onChange={handleInputChange}
                    style={styles.input}
                    className='border-cream-300'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    step='any'
                  />
                  <input
                    type='number'
                    name='longitude'
                    placeholder={t('signuppage.longitudePlaceholder')}
                    value={formData.longitude}
                    onChange={handleInputChange}
                    style={styles.input}
                    className='border-cream-300'
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    step='any'
                  />
                </div>
              </div>

              <label style={styles.checkboxContainer}>
                <input
                  type='checkbox'
                  name='sitter'
                  checked={formData.sitter}
                  onChange={handleInputChange}
                  style={styles.checkbox}
                  className='border-cream-300 text-cream-600 focus:ring-cream-400'
                />
                <span style={styles.labelText} className='text-cream-700'>
                  {t('signuppage.sitterLabel')}
                </span>
              </label>
            </div>

            <div style={styles.buttonContainer}>
              <Button type='submit' disabled={submitting} fullWidth>
                {submitting ? 'Updating...' : t('userupdate.submit')}
              </Button>
              <Button
                as={Link}
                to={`/users/user/${userId}`}
                variant='secondary'
                fullWidth
              >
                {t('userupdate.backbutton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default UpdateUserForm
