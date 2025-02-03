import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const SignUpPage = () => {
 const [username, setUsername] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [profilePicture, setProfilePicture] = useState("");

 const nav = useNavigate()

 async function handleSubmit(e) {
   e.preventDefault();

   const newUser = {
     username: username,
     email: email,
     password: password,
   };

   try {
     await axios.get(`${BACKEND_URL}/users/`).then((response) => {
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
         axios.post(`${BACKEND_URL}/users/signup`, newUser);
         alert("User created successfully");
         setUsername("");
         setEmail("");
         setPassword("");
         setProfilePicture("");
         nav("/login");
       }
     });
   } catch (error) {
     console.log(error);
   }
 }
 return (
   <div>
     <h1>Become a PawKeeper</h1>
     <form onSubmit={handleSubmit} className="form">
       <label>
         Username:
         <input
           type="text"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
         />
       </label>
       <label>
         Email:
         <input
           type="text"
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
       <label>
         Profile Picture:
         <input
           type="file"
           value={profilePicture}
           onChange={(e) => setProfilePicture(e.target.value)}
         />
       </label>
       <button>Sign up</button>
     </form>
   </div>
 );
};

export default SignUpPage;