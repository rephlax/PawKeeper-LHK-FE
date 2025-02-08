import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const LogInPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { authenticateUser, user , userId} = useContext(AuthContext);
  const nav = useNavigate();
  

  async function handleLogin(e) {
    e.preventDefault();

    const userToLogin = {
      email,
      password,
    };

    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/users/login`,
        userToLogin
      );

      alert("Login Sucessfull", data);
      
      // console.log(data)
      // console.log(userId)

      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userId", data.userId);
      

      await authenticateUser();

      nav(`/users/user/${data.userId}`);
    } catch (error) {
      setError(error);
      alert(error.response.data.message)
      console.log("here is the error", error);
    }
  }
  return (
    <div>
      <h1>{t('loginpage.title')}</h1>
      <form className="form" onSubmit={handleLogin}>
        <label>
        {t('forms.emailLabel')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
        {t('forms.passwordLabel')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>{t('loginpage.loginButton')}</button>
      </form>
    </div>
  );
};

export default LogInPage;