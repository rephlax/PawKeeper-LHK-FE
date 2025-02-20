import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const LogInPage = () => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { authenticateUser, user, userId } = useContext(AuthContext)
  const nav = useNavigate()
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const openEyesImg =
    'https://res.cloudinary.com/dmvawq2ak/image/upload/v1739475664/openeyes_snlduk.svg'
  const closedEyesImg =
    'https://res.cloudinary.com/dmvawq2ak/image/upload/v1739475660/closedeyes_jljsee.svg'
  async function handleLogin(e) {
    e.preventDefault()

    const userToLogin = {
      email,
      password,
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/users/login`,
        userToLogin,
      )

      alert('Login Sucessfull', data)

      // console.log(data)
      // console.log(userId)

      localStorage.setItem('authToken', data.authToken)
      localStorage.setItem('userId', data.userId)

      await authenticateUser()

      nav(`/users/user/${data.userId}`)
    } catch (error) {
      setError(error)
      alert(error.response.data.message)
      console.log('here is the error', error)
    }
  }
  return (
    <div className='max-w-md mx-auto p-6 space-y-8'>
      <h1 className='text-3xl font-bold text-cream-800 text-center'>
        {t('loginpage.title')}
      </h1>

      <form
        className='space-y-6 bg-white p-6 rounded-lg shadow-lg border border-cream-200'
        onSubmit={handleLogin}
      >
        <div className='flex justify-center'>
          <img
            src={isPasswordFocused ? closedEyesImg : openEyesImg}
            alt='Cat eyes'
            className='w-24 h-24 object-contain transform transition-transform duration-300'
          />
        </div>

        <div className='space-y-4'>
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
              {t('forms.passwordLabel')}
            </span>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
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
          {t('loginpage.loginButton')}
        </button>
      </form>
    </div>
  )
}

export default LogInPage
