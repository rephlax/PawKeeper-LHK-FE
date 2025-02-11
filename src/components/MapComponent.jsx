import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MapComponent = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPins, setNearbyPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isPinCreationMode, setIsPinCreationMode] = useState(false);
  const [newPinLocation, setNewPinLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const autocompleteRef = useRef(null);
  const markersRef = useRef({});

  // Debug logging for sitter status
  useEffect(() => {
    console.log('User Object:', user);
    console.log('Is Sitter:', user?.sitter);
    console.log('Nearby Pins:', nearbyPins);
  }, [user, nearbyPins]);

  useEffect(() => {
    handleGetCurrentLocation();
  }, []);

  useEffect(() => {
    if (socket && userLocation) {
      if (user?.sitter) {
        socket.emit('share_location', userLocation, (response) => {
          if (response?.error) {
            console.error('Location sharing failed');
          }
        });
      }

      socket.emit('search_nearby_sitters', 
        { 
          lat: userLocation.lat, 
          lng: userLocation.lng, 
          radius: 10 
        }, 
        (response) => {
          if (response?.sitters) {
            setNearbyPins(response.sitters);
          }
        }
      );
    }
  }, [socket, userLocation, user]);

  // Handle markers when map or location changes
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Add user location marker
    if (userLocation) {
      try {
        const userMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: userLocation,
          title: 'Your Location',
          content: new window.google.maps.marker.PinElement({
            scale: 1.2,
            background: '#FFBD80', // cream-500
            glyphColor: '#FFFFFF',
            glyph: "📍"
          }).element
        });

        markersRef.current['user'] = userMarker;
      } catch (error) {
        console.error('Error creating user marker:', error);
      }
    }

    // Add nearby sitter markers
    nearbyPins.forEach(pin => {
      try {
        const position = {
          lat: pin.location.coordinates.latitude,
          lng: pin.location.coordinates.longitude
        };

        const marker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position,
          title: pin.title,
          content: new window.google.maps.marker.PinElement({
            scale: 1,
            background: '#FFA64D', // cream-700
            glyphColor: '#FFFFFF',
            glyph: "🐾"
          }).element
        });

        marker.addListener('click', () => setSelectedPin(pin));
        markersRef.current[pin._id] = marker;
      } catch (error) {
        console.error('Error creating pin marker:', error);
      }
    });

  }, [map, nearbyPins, userLocation]);

  // Map click handler for pin creation
  const handleMapClick = (event) => {
    if (isPinCreationMode && user?.sitter) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setNewPinLocation({ lat, lng });
    }
  };

  // Start pin creation mode
  const handleStartPinCreation = () => {
    setIsPinCreationMode(true);
    setNewPinLocation(null);
  };

  // Cancel pin creation
  const handleCancelPinCreation = () => {
    setIsPinCreationMode(false);
    setNewPinLocation(null);
  };

  // Confirm pin location and redirect to pin creation form
  const handleConfirmPinLocation = () => {
    if (newPinLocation) {
      // Navigate to pin creation with pre-filled location
      window.location.href = `/sitter/create-pin?lat=${newPinLocation.lat}&lng=${newPinLocation.lng}`;
    }
  };

  const handleGetCurrentLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        if (map) {
          map.panTo(location);
          map.setZoom(14);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError("Unable to retrieve your location. Please make sure location services are enabled.");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      setUserLocation(location);
      if (map) {
        map.panTo(location);
        map.setZoom(14);
      }
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '500px'
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  const mapOptions = {
    mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true
  };

  return (
    <div className="relative flex flex-col gap-4 bg-cream-50/50 p-6 rounded-xl">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 bg-cream-100/80 rounded-lg backdrop-blur-sm border border-cream-300 shadow-cream">
        <div className="flex-grow">
          <Autocomplete
            onLoad={ref => autocompleteRef.current = ref}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Search location..."
              className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-cream-500 
                       placeholder:text-cream-600 text-cream-800"
            />
          </Autocomplete>
        </div>
        <button
          onClick={handleGetCurrentLocation}
          className="px-4 py-2 text-cream-800 bg-cream-200 rounded-lg 
                   hover:bg-cream-300 transition-colors duration-200 
                   border border-cream-300 min-w-[140px] shadow-cream
                   flex items-center justify-center gap-2"
        >
          <span>📍</span> Current Location
        </button>
      </div>

      {locationError && (
        <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded text-red-700">
          {locationError}
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border border-cream-300 shadow-cream">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || defaultCenter}
          zoom={12}
          onLoad={setMap}
          onClick={handleMapClick}
          options={mapOptions}
        >
          {selectedPin && (
            <InfoWindow
              position={{
                lat: selectedPin.location.coordinates.latitude,
                lng: selectedPin.location.coordinates.longitude
              }}
              onCloseClick={() => setSelectedPin(null)}
            >
              <div className="p-4 max-w-sm bg-cream-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-cream-800">
                  {selectedPin.title}
                </h3>
                <p className="text-cream-700 mb-2">
                  {selectedPin.description}
                </p>
                {selectedPin.services && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-cream-700">Services:</span>
                    <span className="text-cream-600"> {selectedPin.services.join(', ')}</span>
                  </p>
                )}
                {selectedPin.hourlyRate && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-cream-700">Rate:</span>
                    <span className="text-cream-600"> ${selectedPin.hourlyRate}/hr</span>
                  </p>
                )}
                {user?.sitter && selectedPin.user === user._id && (
                  <Link 
                    to="/sitter/create-pin"
                    className="inline-block mt-2 px-3 py-1 text-cream-700 
                             hover:text-cream-800 bg-cream-200 
                             hover:bg-cream-300 rounded-md transition-colors 
                             text-sm border border-cream-300"
                  >
                    Edit My Pin
                  </Link>
                )}
              </div>
            </InfoWindow>
          )}

          {/* New Pin Creation Marker */}
          {newPinLocation && (
            <Marker 
              position={newPinLocation}
              draggable={true}
              onDragEnd={(e) => {
                setNewPinLocation({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng()
                });
              }}
            />
          )}
        </GoogleMap>

        {/* Pin Creation Controls */}
        {user?.sitter && (
          <div className="absolute bottom-4 right-4">
            {!isPinCreationMode ? (
              <button 
                onClick={handleStartPinCreation}
                className="px-4 py-2 text-cream-800 bg-cream-200 rounded-lg 
                           hover:bg-cream-300 transition-colors duration-200 
                           border border-cream-300 shadow-cream
                           flex items-center gap-2"
              >
                {nearbyPins.some(pin => pin.user === user._id) 
                  ? '✏️ Edit My Pin' 
                  : '📍 Add My Location'}
              </button>
            ) : (
              <div className="flex gap-2">
                {newPinLocation ? (
                  <button 
                    onClick={handleConfirmPinLocation}
                    className="px-4 py-2 text-cream-800 bg-cream-300 rounded-lg"
                  >
                    Confirm Location
                  </button>
                ) : (
                  <p className="text-cream-700">Click on the map to set your location</p>
                )}
                <button 
                  onClick={handleCancelPinCreation}
                  className="px-4 py-2 text-cream-600 bg-cream-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex gap-4 p-3 bg-cream-100/80 rounded-lg backdrop-blur-sm 
                    border border-cream-300 text-sm text-cream-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FFBD80]"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FFA64D]"></div>
          <span>Pet Sitters</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;