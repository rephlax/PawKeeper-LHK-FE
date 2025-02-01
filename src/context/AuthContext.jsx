import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthWrapper = ({ children }) => {
  const [userId, setUserId] = useState(null);
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
          setUserId(responseToVerify.data.currentUser._id);
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
    localStorage.removeItem("userId");
    nav("/log-in");
  }

  useEffect(() => {
    authenticateUser();
  }, []);

  // useEffect(() => {
  //   if (userId) {
  //     localStorage.setItem("userId", userId);
  //   } else {
  //     localStorage.removeItem("userId"); // Remove userId if null
  //   }
  // }, [userId]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSignedIn,
        userId,
        setUserId,
        authenticateUser,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthWrapper };
