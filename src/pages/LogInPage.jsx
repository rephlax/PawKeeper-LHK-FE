import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { authenticateUser } = useContext(AuthContext);
  const nav = useNavigate();
  const { userId } = useContext(AuthContext);

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
      console.log(data._id)

      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userId", userId);
      console.log(userId);

      await authenticateUser();

      nav(`/users/user/${userId}`);
    } catch (error) {
      console.log("here is the error", error);
      setError(error.response.data.message);
    }
  }
  return (
    <div>
      <h1>Log in page</h1>
      <form className="form" onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button>Login</button>
      </form>
    </div>
  );
};

export default LogInPage;
