import axios from 'axios'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageWrapper from '../../Layout/PageWrapper'
import { Button } from '../../Common'
import { handleInputFocus, handleInputBlur } from '../../Common/FormStyles'
import { styles } from './PasswordChange.styles'
import { Check, X } from 'lucide-react'

const webToken = localStorage.getItem('authToken')
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const PasswordChange = () => {
  const { t } = useTranslation()
  const { userId } = useParams()
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConf: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const nav = useNavigate()

  const handleInputChange = e => {
    const { name, value } = e.target
    setPasswords(prev => ({
      ...prev,
      [name]: value,
    }))
    setError('')
  }

  const calculatePasswordStrength = password => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25
    return strength
  }

  const passwordRequirements = [
    {
      met: passwords.newPassword.length >= 8,
      text: 'At least 8 characters',
    },
    {
      met:
        /[a-z]/.test(passwords.newPassword) &&
        /[A-Z]/.test(passwords.newPassword),
      text: 'Upper and lowercase letters',
    },
    {
      met: /[0-9]/.test(passwords.newPassword),
      text: 'At least one number',
    },
    {
      met: /[^a-zA-Z0-9]/.test(passwords.newPassword),
      text: 'At least one special character',
    },
  ]

  async function handlePasswordChange(e) {
    e.preventDefault()

    if (passwords.newPassword !== passwords.newPasswordConf) {
      setError('New passwords do not match')
      return
    }

    if (passwords.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const newPasswords = {
        old: passwords.currentPassword,
        new: passwords.newPassword,
      }

      await axios.patch(
        `${BACKEND_URL}/users/update-user/${userId}/password-change`,
        newPasswords,
        { headers: { authorization: `Bearer ${webToken}` } },
      )

      alert('Password changed successfully!')
      nav(`/users/user/${userId}`)
    } catch (error) {
      console.error('Password change error:', error)
      setError(
        error.response?.data?.message ||
          'Failed to change password. Please check your current password.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const passwordStrength = calculatePasswordStrength(passwords.newPassword)
  const contentStyle =
    window.innerWidth >= 640 ? styles.content.large : styles.content.base

  return (
    <PageWrapper maxWidth='sm'>
      <div style={styles.container} className='bg-white border-cream-200'>
        <div style={contentStyle}>
          <h2 style={styles.title} className='text-cream-800'>
            {t('password.title')}
          </h2>

          {error && <div style={styles.errorAlert}>{error}</div>}

          <form onSubmit={handlePasswordChange} style={styles.form}>
            <div style={styles.fieldsContainer}>
              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('password.current')}
                </span>
                <input
                  type='password'
                  name='currentPassword'
                  value={passwords.currentPassword}
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
                  {t('password.new')}
                </span>
                <input
                  type='password'
                  name='newPassword'
                  value={passwords.newPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                {passwords.newPassword && (
                  <>
                    <div style={styles.passwordStrength}>
                      <div style={styles.strengthBar}>
                        <div style={styles.strengthFill(passwordStrength)} />
                      </div>
                    </div>
                    <div style={styles.requirements}>
                      {passwordRequirements.map((req, index) => (
                        <div key={index} style={styles.requirementItem}>
                          {req.met ? (
                            <Check size={12} className='text-green-500' />
                          ) : (
                            <X size={12} className='text-red-500' />
                          )}
                          <span
                            className={
                              req.met ? 'text-green-700' : 'text-cream-600'
                            }
                          >
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </label>

              <label style={styles.label}>
                <span style={styles.labelText} className='text-cream-700'>
                  {t('password.confirm')}
                </span>
                <input
                  type='password'
                  name='newPasswordConf'
                  value={passwords.newPasswordConf}
                  onChange={handleInputChange}
                  style={styles.input}
                  className='border-cream-300'
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
                {passwords.newPasswordConf &&
                  passwords.newPassword !== passwords.newPasswordConf && (
                    <span style={styles.errorMessage}>
                      Passwords do not match
                    </span>
                  )}
              </label>
            </div>

            <div style={styles.buttonContainer}>
              <Button
                type='submit'
                disabled={submitting || passwordStrength < 100}
                fullWidth
              >
                {submitting ? 'Changing Password...' : t('password.change')}
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
                {t('password.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageWrapper>
  )
}

export default PasswordChange
