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
      <div className='bg-white rounded-lg shadow-lg border border-cream-200'>
        <div className='p-6 sm:p-8'>
          {' '}
          <h2 className='text-2xl font-bold text-cream-800 mb-6 text-center'>
            Add New Pet
          </h2>
          <form className='space-y-6' onSubmit={handleCreatePet}>
            <div className='space-y-4'>
              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('addpet.name')}:
                </span>
                <input
                  type='text'
                  value={petName}
                  onChange={e => setPetName(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('addpet.age')}:
                </span>
                <input
                  type='number'
                  value={petAge}
                  onChange={e => setPetAge(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('addpet.species')}:
                </span>
                <input
                  type='text'
                  value={petSpecies}
                  onChange={e => setPetSpecies(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <div className='space-y-2'>
                <span className='block text-sm font-medium text-cream-700'>
                  {t('addpet.petpicture')}:
                </span>
                <div className='flex gap-3'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='flex-1 px-4 py-2 border border-cream-300 rounded-lg 
                             text-cream-700 file:mr-4 file:py-2 file:px-4 file:border-0
                             file:text-sm file:font-medium file:bg-cream-100
                             file:text-cream-700 hover:file:bg-cream-200'
                  />
                  <button
                    type='button'
                    onClick={handleUpload}
                    disabled={uploading}
                    className='px-4 py-2 bg-cream-600 text-white rounded-lg
                             hover:bg-cream-700 transition-colors duration-200
                             disabled:bg-cream-400 disabled:cursor-not-allowed'
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              </div>
            </div>

            <button
              type='submit'
              className='w-full px-4 py-2 bg-cream-600 text-white rounded-lg
                       hover:bg-cream-700 transition-colors duration-200'
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
