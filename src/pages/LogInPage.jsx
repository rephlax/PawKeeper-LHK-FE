import axios from 'axios'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005"

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

  // Container
  const containerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2.5rem 0',
  }

  // Title
  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
  }

  // Form container
  const formContainerStyle = {
    width: '100%',
    maxWidth: '28rem',
    borderRadius: '0.75rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    borderWidth: '1px',
    borderStyle: 'solid',
  }

  // Cat image container
  const imageContainerStyle = {
    padding: '1.5rem 0',
    display: 'flex',
    justifyContent: 'center',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  }

  // Image
  const imageStyle = {
    width: '7rem',
    height: '7rem',
    objectFit: 'contain',
    transition: 'transform 0.3s',
  }

  // Form section
  const formSectionStyle = {
    padding: '2rem',
  }

  // Input group
  const inputGroupStyle = {
    marginBottom: '1.5rem',
  }

  // Label
  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
  }

  // Input
  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    borderWidth: '1px',
    borderStyle: 'solid',
    outline: 'none',
  }

  // Input focus
  const handleInputFocus = e => {
    e.target.classList.remove('border-cream-300')
    e.target.classList.add(
      'border-cream-500',
      'ring-2',
      'ring-cream-300',
      'ring-opacity-50',
    )
  }

  // Input blur
  const handleInputBlur = e => {
    e.target.classList.remove(
      'border-cream-500',
      'ring-2',
      'ring-cream-300',
      'ring-opacity-50',
    )
    e.target.classList.add('border-cream-300')
  }

  // Forgot password link
  const forgotLinkStyle = {
    textAlign: 'right',
    marginBottom: '1.5rem',
    display: 'block',
    fontSize: '0.875rem',
  }

  // Button
  const buttonStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    color: 'white',
  }

  // Button hover
  const handleButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handleButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  // Sign up section
  const signupContainerStyle = {
    padding: '1rem',
    textAlign: 'center',
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    fontSize: '0.875rem',
  }

  // Image hover
  const handleImageHover = e => {
    e.target.style.transform = 'scale(1.05)'
  }

  const handleImageLeave = e => {
    e.target.style.transform = 'scale(1)'
  }

  async function handleLogin(e) {
    e.preventDefault()
    const userToLogin = { email, password }
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/users/login`,
        userToLogin,
      )
      alert('Login Successful', data)
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
    <div style={containerStyle}>
      <h1 style={titleStyle} className='text-cream-800'>
        {t('loginpage.title')}
      </h1>

      <div style={formContainerStyle} className='bg-white border-cream-200'>
        {/* Cat image section */}
        <div
          style={imageContainerStyle}
          className='bg-cream-50 border-cream-100'
        >
          <img
            src={isPasswordFocused ? closedEyesImg : openEyesImg}
            alt='Cat eyes'
            style={imageStyle}
            onMouseOver={handleImageHover}
            onMouseOut={handleImageLeave}
          />
        </div>

        {/* Form fields section */}
        <div style={formSectionStyle}>
          <form onSubmit={handleLogin}>
            {/* Email field */}
            <div style={inputGroupStyle}>
              <label style={labelStyle} className='text-cream-700'>
                {t('forms.emailLabel')}
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter your email'
                style={inputStyle}
                className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
              />
            </div>

            {/* Password field */}
            <div style={inputGroupStyle}>
              <label style={labelStyle} className='text-cream-700'>
                {t('forms.passwordLabel')}
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={e => {
                  setIsPasswordFocused(true)
                  handleInputFocus(e)
                }}
                onBlur={e => {
                  setIsPasswordFocused(false)
                  handleInputBlur(e)
                }}
                placeholder='Enter your password'
                style={inputStyle}
                className='border-cream-300 bg-white text-cream-900 placeholder-cream-400'
                required
              />
            </div>

            {/* Forgot password link */}
            <Link
              to='/forgot-password'
              style={forgotLinkStyle}
              className='text-cream-600 hover:text-cream-700'
            >
              Forgot password?
            </Link>

            {/* Submit button */}
            <button
              type='submit'
              style={buttonStyle}
              className='bg-cream-600'
              onMouseOver={handleButtonHover}
              onMouseOut={handleButtonLeave}
            >
              {t('loginpage.loginButton')}
            </button>
          </form>
        </div>

        {/* Sign up section */}
        <div
          style={signupContainerStyle}
          className='bg-gray-50 border-gray-100 text-gray-600'
        >
          Don't have an account?{' '}
          <Link
            to='/sign-up'
            className='text-cream-600 hover:text-cream-700 font-medium'
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LogInPage

