import { useState } from "react";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  return (
    <div>
      <h1>Become a PawKeeper</h1>
      <form action="">
        <label>
          Username:
          <input type="text" value={username}/>
        </label>
        <label>
          Password:
          <input type="text" value={password}/>
        </label>
        <label>
          Profile Picture:
          <input type="text" value={profilePicture}/>
        </label>
        <button>Signup</button>
      </form>
    </div>
  );
};

export default SignUpPage;
