import React, { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import MapComponent from "./MapComponent";
import axios from 'axios';

const Navbar = () => {
  const { t } = useTranslation();
  const { 
    isSignedIn, 
    user, 
    authenticateUser, 
    handleLogout 
  } = useAuth();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const toggleSitterMode = async () => {
    if (!user) return;

    try {
      const webToken = localStorage.getItem("authToken");
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-user/${user._id}`, 
        { sitter: !user.sitter },
        { 
          headers: { 
            Authorization: `Bearer ${webToken}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      // Re-authenticate to update user context
      await authenticateUser();

      alert(`Sitter mode ${user.sitter ? 'deactivated' : 'activated'}!`);

    } catch (error) {
      console.error('Error toggling sitter mode:', error);
      alert('Could not change sitter status. Please try again.');
    }
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
            {/* Sitter Mode Toggle */}
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="sitter-mode-toggle"
                checked={user?.sitter || false}
                onChange={toggleSitterMode}
                className="form-checkbox h-5 w-5 text-cream-600 cursor-pointer"
              />
              <label 
                htmlFor="sitter-mode-toggle" 
                className="text-sm text-cream-700 cursor-pointer"
              >
                Sitter Mode
              </label>
            </div>
            
            <button 
              onClick={() => setIsMapOpen(!isMapOpen)} 
              className="navbar-link"
            >
              {isMapOpen ? 'Close Map' : 'View Map'}
            </button>
            
            {user?.sitter && (
              <>
                <Link to="/sitter/create-pin" className="navbar-link">
                  Create Sitter Pin
                </Link>
                <Link to="/sitter/search" className="navbar-link">
                  Find Sitters
                </Link>
              </>
            )}
            <Link to={`/users/user/${user._id}`} className="navbar-link">
              Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="navbar-link"
            >
              Logout
            </button>
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