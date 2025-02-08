import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5005";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthWrapper = ({ children }) => {
  const [userId, setUserId] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const nav = useNavigate();
  const authenticateUser = async (userId) => {
    const webToken = localStorage.getItem("authToken");

    if (webToken) {
      try {
        const responseToVerify = await axios.get(
          `${BACKEND_URL}/users/verify`,
          {
            headers: {
              Authorization: `Bearer ${webToken}`,
              "Content-Type": "application/json",
              //  'Origin': window.location.origin
            },
            withCredentials: true,
          }
        );

        if (responseToVerify && responseToVerify.data) {
          // console.log(responseToVerify.data.currentUser);
          // console.log(responseToVerify.data.currentUser._id);
          setUserId(responseToVerify.data.currentUser._id);
          setUser(responseToVerify.data.currentUser);
          setIsSignedIn(true);
          setLoading(false);
        }
      } catch (error) {
        console.log(
          "Error validating the token",
          error.response?.data || error.message
        );
        setIsSignedIn(false);
        setLoading(false);
        setUser(null);
        localStorage.removeItem("authToken");
      }
    } else {
      console.log("No token Present");
      setIsSignedIn(false);
      setLoading(false);
      setUser(null);
    }
  };

  async function handleDeleteUser() {
    const webToken = localStorage.getItem("authToken")
   if (webToken) {
    try {
      const deletedUser = await axios
        .delete(`${BACKEND_URL}/users/delete-user/${userId}`, {
          headers: {authorization: `Bearer ${webToken}`}
        })
        .then(() => {
          alert("User Deleted!")
          handleLogout();
        });
    } catch (error) {
      console.log("Here is the Error", error)
    }
   }
  }

  async function handleUpdateUser() {
    const webToken = localStorage.getItem("authToken");

    if(webToken) {
      try {
        
      } catch (error) {
        console.log("Here is the Error", error)
      }
    }

  }

  function handleLogout() {
    console.log("Successfully Logged Out!");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setUser(null);
    setIsSignedIn(false);
    nav("/log-in");
  }

  useEffect(() => {
    authenticateUser();
  }, []);

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
        handleDeleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext, AuthWrapper };
