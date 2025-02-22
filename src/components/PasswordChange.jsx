import axios from 'axios'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from './PageWrapper'

const webToken = localStorage.getItem('authToken')
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const PasswordChange = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConf, setNewPasswordConf] = useState('')
  const nav = useNavigate()

  // Outer container
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

  // Form container
  const formContainerStyle = {
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '1.5rem',
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
    <div style={containerStyle} className='bg-white border-cream-200'>
      <div style={contentStyle}>
        <h2 style={titleStyle} className='text-cream-800'>
          Change Password
        </h2>
        <form
          onSubmit={handlePasswordChange}
          style={formContainerStyle}
          className='bg-white border-cream-200'
        >
          <div style={fieldsContainerStyle}>
            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('password.current')}
              </span>
              <input
                type='password'
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('password.new')}
              </span>
              <input
                type='password'
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>

            <label style={labelStyle}>
              <span style={labelTextStyle} className='text-cream-700'>
                {t('password.confirm')}
              </span>
              <input
                type='password'
                value={newPasswordConf}
                onChange={e => setNewPasswordConf(e.target.value)}
                style={inputStyle}
                className='border-cream-300'
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </label>
          </div>

          <button
            type='submit'
            style={submitButtonStyle}
            className='bg-cream-600 text-white'
            onMouseOver={handleSubmitButtonHover}
            onMouseOut={handleSubmitButtonLeave}
          >
            {t('password.change')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PasswordChange
