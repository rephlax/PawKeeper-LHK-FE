import { useNavigate } from "react-router-dom";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

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
  const [isMapOpen, setIsMapOpen] = useState(false);

  const nav = useNavigate();

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  const authenticateUser = async () => {
    const webToken = localStorage.getItem("authToken");
    if (webToken) {
      try {
        const responseToVerify = await axios.get(
          `${BACKEND_URL}/users/verify`,
          getAuthConfig(),
        );

        if (responseToVerify && responseToVerify.data) {
          const currentUserId = responseToVerify.data.currentUser._id;

          const userResponse = await axios.get(
            `${BACKEND_URL}/users/user/${currentUserId}`,
            getAuthConfig(),
          );

          if (userResponse && userResponse.data) {
            setUserId(currentUserId);
            setUser(userResponse.data);
            setIsSignedIn(true);
            console.log(
              "User authenticated with sitter status:",
              userResponse.data.sitter,
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.log(
          "Error validating the token",
          error.response?.data || error.message,
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

  // Sitter-specific methods
  const isSitter = () => {
    return user?.sitter || false;
  };

  const getSitterStatus = async (targetUserId) => {
    try {
      if (targetUserId === userId) {
        return user?.sitter || false;
      }

      const response = await axios.get(
        `${BACKEND_URL}/users/user/${targetUserId}`,
        getAuthConfig(),
      );

      return response.data?.sitter || false;
    } catch (error) {
      console.error("Error getting sitter status:", error);
      return false;
    }
  };

  const updateSitterStatus = async (newStatus) => {
    if (!userId || !isSignedIn) return false;

    try {
      const response = await axios.patch(
        `${BACKEND_URL}/users/update-user/${userId}`,
        { sitter: newStatus },
        getAuthConfig(),
      );

      if (response.data?.foundUser) {
        setUser((prev) => ({
          ...prev,
          sitter: newStatus,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating sitter status:", error);
      return false;
    }
  };

  async function handleDeleteUser() {
    try {
      await axios
        .delete(`${BACKEND_URL}/users/delete-user/${userId}`, getAuthConfig())
        .then(() => {
          alert("User Deleted!");
          handleLogout();
        });
    } catch (error) {
      console.log("Here is the Error", error);
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

  useEffect(() => {
    if (user) {
      console.log("Current user sitter status:", user.sitter);
    }
  }, [user]);

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
        isMapOpen,
        setIsMapOpen,
        isSitter,
        getSitterStatus,
        updateSitterStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthWrapper };
