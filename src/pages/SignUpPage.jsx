import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@react-google-maps/api';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const SignUpPage = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [rate, setRate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [sitter, setSitter] = useState(false);
  const [rating, setRating] = useState(0);
  const autocompleteRef = useRef(null);

  const nav = useNavigate();

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      setLatitude(place.geometry.location.lat());
      setLongitude(place.geometry.location.lng());
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
      profilePicture,
      rate,
      latitude,
      longitude,
      sitter,
      rating
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
          setLatitude("");
          setLongitude("");
          setRate("");
          setSitter(false);
          nav("/log-in");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>{t('signuppage.title')}</h1>
      <form onSubmit={handleSubmit} className="form">
        <label>
          {t('forms.emailLabel')}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          {t('forms.passwordLabel')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          {t('signuppage.usernameLabel')}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          {t('signuppage.profilePictureLabel')}
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
          />
        </label>

        <label>
          {t('signuppage.rateLabel')}
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </label>

        <div className="location-section">
          <label>{t('signuppage.locationLabel')}</label>
          
          <Autocomplete
            onLoad={ref => autocompleteRef.current = ref}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Search for a city"
              className="location-search"
            />
          </Autocomplete>

          <button 
            type="button" 
            onClick={getCurrentLocation}
            className="get-location-btn"
          >
            Get Current Location
          </button>

          <div className="coordinates-inputs">
            <input
              type="number"
              placeholder={t('signuppage.latitudePlaceholder')}
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
            <input
              type="number"
              placeholder={t('signuppage.longitudePlaceholder')}
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <label>
          {t('signuppage.sitterLabel')}
          <input
            type="checkbox"
            checked={sitter}
            onChange={(e) => setSitter(e.target.checked)}
          />
        </label>

        <button type="submit">{t('signuppage.signupButton')}</button>
      </form>
    </div>
  );
};

export default SignUpPage;