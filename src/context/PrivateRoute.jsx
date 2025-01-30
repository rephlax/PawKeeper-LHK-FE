import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  
  const { loading, isSignedIn } = useContext(AuthContext);
  if (loading) {
    return <p>Loading...</p>;
  }
  if (!isSignedIn) {
    return <Navigate to="/log-in" />;
  }
  return <div>{children}</div>;
};
export default PrivateRoute;