import axios from 'axios';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const webToken = localStorage.getItem('authToken');
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const PasswordChange = () => {
  const { t } = useTranslation();
  const { userId } = useParams();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConf, setNewPasswordConf] = useState('');
  const nav = useNavigate();
  async function handlePasswordChange(e) {
    e.preventDefault();
    if (newPassword === newPasswordConf) {
      try {
        const newPasswords = {
          old: currentPassword,
          new: newPassword,
        };
        const responseToChange = await axios.patch(
          `${BACKEND_URL}/users/update-user/${userId}/password-change`,
          newPasswords,
          { headers: { authorization: `Bearer ${webToken}` } }
        );

        alert('password Changed with sucess!');
        nav(`/users/user/${userId}`);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div>
      <form onSubmit={handlePasswordChange} className="form">
        <label>
          {t('password.current')}
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
        </label>
        <label>
          {t('password.new')}
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          {t('password.confirm')}
          <input
            type="password"
            value={newPasswordConf}
            onChange={e => setNewPasswordConf(e.target.value)}
          />
        </label>
        <button>{t('password.change')}</button>
      </form>
    </div>
  );
};
export default PasswordChange;
