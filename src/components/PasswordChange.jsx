import axios from 'axios'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const webToken = localStorage.getItem('authToken')
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const PasswordChange = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConf, setNewPasswordConf] = useState('')
  const nav = useNavigate()

  async function handlePasswordChange(e) {
    e.preventDefault()
    if (newPassword === newPasswordConf) {
      try {
        const newPasswords = {
          old: currentPassword,
          new: newPassword,
        }
        const responseToChange = await axios.patch(
          `${BACKEND_URL}/users/update-user/${userId}/password-change`,
          newPasswords,
          { headers: { authorization: `Bearer ${webToken}` } },
        )

        alert('Password changed successfully!')
        nav(`/users/user/${userId}`)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className='max-w-md mx-auto p-6'>
      <h2 className='text-2xl font-bold text-cream-800 mb-6 text-center'>
        Change Password
      </h2>

      <form
        onSubmit={handlePasswordChange}
        className='bg-white rounded-lg shadow-lg border border-cream-200 p-6 space-y-6'
      >
        <div className='space-y-4'>
          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('password.current')}
            </span>
            <input
              type='password'
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('password.new')}
            </span>
            <input
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-medium text-cream-700'>
              {t('password.confirm')}
            </span>
            <input
              type='password'
              value={newPasswordConf}
              onChange={e => setNewPasswordConf(e.target.value)}
              className='mt-1 block w-full px-4 py-2 border border-cream-300 rounded-lg 
                       focus:ring-2 focus:ring-cream-400 focus:border-transparent 
                       transition duration-200'
            />
          </label>
        </div>

        <button
          type='submit'
          className='w-full bg-cream-600 text-white py-2 px-4 rounded-lg
                   hover:bg-cream-700 transition-colors duration-200'
        >
          {t('password.change')}
        </button>
      </form>
    </div>
  )
}

export default PasswordChange
