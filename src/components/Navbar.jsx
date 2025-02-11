import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import MapComponent from "./MapComponent";
import { useState } from "react";

const Navbar = () => {
  const { t } = useTranslation();
  const { isSignedIn, user } = useAuth();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleMap = () => {
    setIsMapOpen(!isMapOpen);
  };

  return (
    <nav className="flex items-center justify-between h-full px-8 relative">
      <div className="navbar-logo">
        <Link to="/">
          <img className="w-20 h-20" src={logo} alt="PawKeeper Logo" />
        </Link>
      </div>

      <div
        className="flex gap-4 justify-evenly items-center text-lg"
        style={{ paddingRight: "10px" }}
      >
        {!isSignedIn ? (
          <>
            <Link to="/sign-up" className="navbar-link">
              {t("navbar.signup")}
            </Link>
            <Link to="/log-in" className="navbar-link">
              {t("navbar.login")}
            </Link>
          </>
        ) : (
          <>
            {user.sitter && (
              <>
                <Link to="/sitter/create-pin" className="navbar-link">
                  Create Sitter Pin
                </Link>
                <Link to="/sitter/search" className="navbar-link">
                  Find Sitters
                </Link>
              </>
            )}
            <button 
              onClick={toggleMap} 
              className="navbar-link"
            >
              {isMapOpen ? 'Close Map' : 'View Map'}
            </button>
            <Link to={`/users/user/${user._id}`} className="navbar-link">
              Profile
            </Link>
          </>
        )}
        
        <div>
          <LanguageSwitcher />
        </div>
      </div>

      {isMapOpen && isSignedIn && (
        <div className="absolute top-full left-0 w-full z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <MapComponent />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;