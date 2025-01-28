import { useState } from "react";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");



  function handleSubmit(e) {
    e.preventDefault();

    const newUser = {
      username: username,
      email: email,
      password: password,
    };

    axios.get("http://localhost:5005/").then((response) => {
      const userExists = response.data.some(
        (user) => user.username === newUser.username
      );
      const emailExists = response.data.some(
        (user) => user.email === newUser.email
      );

      if (userExists) {
        alert("User already exists");
      } else if (emailExists) {
        alert("Email already exists");
      } else {
        axios.post("http://localhost:5005/signup", newUser);
      }
    });
  }
  return (
    <div>
      <h1>Become a PawKeeper</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername()} />
        </label>
        <label>
          Email:
          <input type="text" value={email} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={handleChange} />
        </label>
        <label>
          Profile Picture:
          <input type="file" value={profilePicture} onChange={handleChange} />
        </label>
        <button>Signup</button>
      </form>
    </div>
  );
};

export default SignUpPage;
