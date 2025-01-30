import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";

const AuthContext = createContext();
const AuthWrapper = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const nav = useNavigate();
  const authenticateUser = async () => {
    const webToken = localStorage.getItem("authToken");

    if (webToken) {
      try {
        const responseToVerify = await axios.get(
          "http://localhost:5005/users/verify",
          { headers: { authorization: `Bearer ${webToken}` } }
        );
        console.log(responseToVerify);
        if (responseToVerify) {
          setUser(responseToVerify.data.currentUser);
          setIsSignedIn(true);
          setLoading(false);          
        }
      } catch (error) {
        console.log("Error validating the token", error);
        setIsSignedIn(false);
        setLoading(false);
        setUser(null);
      }
    } else {
      console.log("No token Present");
      setIsSignedIn(false);
      setLoading(false);
      setUser(null);
    }
  };

  function handleLogout() {
    console.log("Sucessfuly Logged Out!");
    localStorage.removeItem("authToken");
    nav("/log-in");
  }

  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isSignedIn, authenticateUser, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthWrapper };
