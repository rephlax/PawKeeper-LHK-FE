import axios from 'axios'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from './PageWrapper'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'
const webToken = localStorage.getItem('authToken')

const AddPetForm = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const [petName, setPetName] = useState('')
  const [petAge, setPetAge] = useState(0)
  const [petSpecies, setPetSpecies] = useState('')
  const [petPicture, setPetPicture] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const nav = useNavigate()

  // Container
  const containerStyle = {
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Content container
  const contentStyle = {
    padding: '1.5rem',
  }

  // For larger screens
  if (window.innerWidth >= 640) {
    contentStyle.padding = '2rem'
  }

  // Title
  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  }

  // Form styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  }

  // Fields container
  const fieldsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  // Label
  const labelStyle = {
    display: 'block',
  }

  // Label text
  const labelTextStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
  }

  // Input
  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    marginTop: '0.25rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
  }

  // Input focus
  const handleInputFocus = e => {
    e.target.classList.remove('border-cream-300')
    e.target.classList.add('border-transparent', 'ring-2', 'ring-cream-400')
  }

  // Input blur
  const handleInputBlur = e => {
    e.target.classList.remove('border-transparent', 'ring-2', 'ring-cream-400')
    e.target.classList.add('border-cream-300')
  }

  // File input container
  const fileContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  }

  // File input wrapper
  const fileWrapperStyle = {
    display: 'flex',
    gap: '0.75rem',
  }

  // File input
  const fileInputStyle = {
    flex: '1',
    padding: '0.5rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
  }

  // Upload button
  const uploadButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  // Upload button hover
  const handleUploadButtonHover = e => {
    if (!uploading) {
      e.target.classList.remove('bg-cream-600')
      e.target.classList.add('bg-cream-700')
    }
  }

  const handleUploadButtonLeave = e => {
    if (!uploading) {
      e.target.classList.remove('bg-cream-700')
      e.target.classList.add('bg-cream-600')
    }
  }

  // Submit button
  const submitButtonStyle = {
    width: '100%',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  // Submit button hover
  const handleSubmitButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handleSubmitButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  async function handleCreatePet(e) {
    e.preventDefault()

    if (webToken) {
      try {
        const newPet = {
          petName,
          petAge,
          petSpecies,
          petPicture,
          owner: userId,
        }
        axios.post(`${BACKEND_URL}/pets/${userId}`, newPet, {
          headers: {
            authorization: `Bearer ${webToken}`,
          },
        })

        alert('Pet Added Sucessfully!')
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.log(error)
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
    formData.append('upload_preset', 'ml_default') // Cloudinary upload preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dzdrwiugn/image/upload',
        formData,
      )

      console.log(response)
      setPetPicture(response.data.secure_url)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageWrapper maxWidth='md'>
      <div style={containerStyle} className='bg-white border-cream-200'>
        <div style={contentStyle}>
          <h2 style={titleStyle} className='text-cream-800'>
            Add New Pet
          </h2>
          <form style={formStyle} onSubmit={handleCreatePet}>
            <div style={fieldsContainerStyle}>
              <label style={labelStyle}>
                <span style={labelTextStyle} className='text-cream-700'>
                  {t('addpet.name')}:
                </span>
                <input
                  type='text'
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </label>

              <label style={labelStyle}>
                <span style={labelTextStyle} className='text-cream-700'>
                  {t('addpet.age')}:
                </span>
                <input
                  type='number'
                  value={petAge}
                  onChange={e => setPetAge(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </label>

              <label style={labelStyle}>
                <span style={labelTextStyle} className='text-cream-700'>
                  {t('addpet.species')}:
                </span>
                <input
                  type='text'
                  value={petSpecies}
                  onChange={e => setPetSpecies(e.target.value)}
                  style={inputStyle}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </label>

              <div style={fileContainerStyle}>
                <span style={labelTextStyle} className='text-cream-700'>
                  {t('addpet.petpicture')}:
                </span>
                <div style={fileWrapperStyle}>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    style={fileInputStyle}
                    className='border-cream-300 text-cream-700 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-cream-100 file:text-cream-700 hover:file:bg-cream-200'
                  />
                  <button
                    type='button'
                    onClick={handleUpload}
                    disabled={uploading}
                    style={uploadButtonStyle}
                    className={
                      uploading
                        ? 'bg-cream-400 text-white disabled:cursor-not-allowed'
                        : 'bg-cream-600 text-white'
                    }
                    onMouseOver={handleUploadButtonHover}
                    onMouseOut={handleUploadButtonLeave}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type='submit'
              style={submitButtonStyle}
              className='bg-cream-600 text-white'
              onMouseOver={handleSubmitButtonHover}
              onMouseOut={handleSubmitButtonLeave}
            >
              {t('addpet.addpet')}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default AddPetForm
