import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import PageWrapper from './PageWrapper'

const webToken = localStorage.getItem('authToken')
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UpdatePet = () => {
  const { userId, petId } = useParams()
  const [petName, setPetName] = useState('')
  const [petAge, setPetAge] = useState('')
  const [petPicture, setPetPicture] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const nav = useNavigate()

  async function handleUpdatePet(e) {
    e.preventDefault()

    const updatedPet = {
      petName,
      petAge,
      petPicture,
    }

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/pets/${petId}`,
        updatedPet,
        {
          headers: { authorization: `Bearer ${webToken}` },
        },
      )

      if (response) {
        alert('Pet Updated')
        nav(`/users/user/${userId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    async function getOnePet() {
      try {
        const petToUpdate = await axios.get(
          `${BACKEND_URL}/pets/${userId}/${petId}`,
          {
            headers: { authorization: `Bearer ${webToken}` },
          },
        )

        const pet = petToUpdate.data
        console.log(pet)
        setPetAge(pet.petAge)
        setPetName(pet.petName)
        setPetPicture(pet.petPicture)
      } catch (error) {
        console.log(error)
      }
    }

    getOnePet()
  }, [userId, petId])

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
          <h2 className='text-2xl font-bold text-cream-800 mb-6 text-center'>
            Update Pet
          </h2>
          <form onSubmit={handleUpdatePet} className='space-y-6'>
            <div className='space-y-4'>
              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  Pet Name:
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
                  Pet Age:
                </span>
                <input
                  type='text'
                  value={petAge}
                  onChange={e => setPetAge(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <div className='space-y-2'>
                <span className='block text-sm font-medium text-cream-700'>
                  Pet Picture:
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
              Update Pet
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default UpdatePet
