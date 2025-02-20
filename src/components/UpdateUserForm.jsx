import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UpdateUserForm = () => {
  const { t } = useTranslation()
  const { user, userId } = useContext(AuthContext)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [rate, setRate] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [sitter, setSitter] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const nav = useNavigate()
  const webToken = localStorage.getItem('authToken')

  useEffect(() => {
    async function getOneUser() {
      if (webToken) {
        try {
          const userToUpdate = await axios.get(
            `${BACKEND_URL}/users/user/${userId}`,
            {
              headers: {
                authorization: `Bearer ${webToken}`,
              },
            },
          )
          const user = userToUpdate.data
          setUsername(user.username)
          setEmail(user.email)
          setProfilePicture(user.profilePicture)
          setRate(user.rate)
          setLatitude(user.location?.coordinates.latitude || 0)
          setLongitude(user.location?.coordinates.longitude || 0)
          setSitter(user.sitter)
        } catch (error) {
          console.log('Here is the error', error)
        }
      }
    }
    getOneUser()
  }, [userId])

  async function handleUpdateUser(e) {
    e.preventDefault()

    const updatedUser = {
      username,
      email,
      profilePicture,
      rate,
      location: {
        coordinates: {
          latitude,
          longitude,
        },
      },
      sitter,
    }

    console.log(updatedUser)

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
        console.log('Here is the Error', error)
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
      setProfilePicture(response.data.secure_url)
      console.log(profilePicture) // Save Cloudinary image URL in state
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageWrapper maxWidth='lg'>
      <div className='bg-white rounded-lg shadow-lg border border-cream-200'>
        <div className='p-6 sm:p-8'>
          <h2 className='text-2xl font-bold text-cream-800 mb-6 text-center'>
            Update Profile
          </h2>

          <form className='space-y-6' onSubmit={handleUpdateUser}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('forms.emailLabel')}
                </span>
                <input
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('signuppage.usernameLabel')}
                </span>
                <input
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <div className='space-y-2'>
                <span className='block text-sm font-medium text-cream-700'>
                  {t('userupdate.profilePictureLabel')}
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

              <label className='block'>
                <span className='text-sm font-medium text-cream-700'>
                  {t('signuppage.rateLabel')}
                </span>
                <input
                  type='number'
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                           focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                           transition duration-200'
                />
              </label>

              <div className='space-y-2 col-span-2'>
                <span className='block text-sm font-medium text-cream-700'>
                  {t('signuppage.locationLabel')}
                </span>
                <div className='grid grid-cols-2 gap-4'>
                  <input
                    type='number'
                    placeholder={t('signuppage.latitudePlaceholder')}
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    className='block w-full px-4 py-2 border border-cream-300 rounded-lg 
                             focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                             transition duration-200'
                  />
                  <input
                    type='number'
                    placeholder={t('signuppage.longitudePlaceholder')}
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    className='block w-full px-4 py-2 border border-cream-300 rounded-lg 
                             focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                             transition duration-200'
                  />
                </div>
              </div>

              <label className='block col-span-2'>
                <div className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={sitter}
                    onChange={e => setSitter(e.target.checked)}
                    className='rounded border-cream-300 text-cream-600 
                             focus:ring-cream-400'
                  />
                  <span className='text-sm font-medium text-cream-700'>
                    {t('signuppage.sitterLabel')}
                  </span>
                </div>
              </label>
            </div>

            <div className='flex gap-4 pt-6'>
              <button
                type='submit'
                className='flex-1 px-4 py-2 bg-cream-600 text-white rounded-lg
                         hover:bg-cream-700 transition-colors duration-200'
              >
                {t('userupdate.submit')}
              </button>
              <Link
                to={`/users/user/${userId}`}
                className='flex-1 px-4 py-2 border-2 border-cream-400 text-cream-700 rounded-lg
                         hover:bg-cream-50 transition-colors duration-200 text-center'
              >
                {t('userupdate.backbutton')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default UpdateUserForm
