import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { setupAdvancedMarkers, updateMarkerPositions } from './utils/markers';
import { DEFAULT_CENTER, getUserLocation } from './utils/location';
import { setupSocketListeners } from './utils/socketHandlers';
import PinForm from '../Modal/PinForm';
import Modal from '../Modal';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MapComponent = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [userPin, setUserPin] = useState(null);
  const [selectedPin, setSelectedPin] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showPinForm, setShowPinForm] = useState(false);
  const [markers, setMarkers] = useState({
    home: null,
    pin: null
  });

  const getAuthConfig = useCallback(() => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`
    }
  }), []);

  const loadUserPin = async () => {
    if (!user?._id) {
      console.log('No user ID available for pin loading');
      return;
    }
  
    try {
      console.log('Attempting to load pin for user:', user._id);
      console.log('Auth config:', getAuthConfig());
      
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/search`,
        {
          params: { userId: user._id },
          ...getAuthConfig()
        }
      );
  
      console.log('Pin search response:', response.data);
      
      if (response.data.length > 0) {
        setUserPin(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading user pin:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }
  };

  const startChat = (pinOwner) => {
    if (socket) {
      socket.emit('start_private_chat', { targetUserId: pinOwner });
    }
  };

  // Load initial user pin
  useEffect(() => {
    loadUserPin();
  }, [user]);

  // Set up location tracking
  useEffect(() => {
    getUserLocation(setUserLocation, setLocationError, map, socket);
    const locationInterval = setInterval(() => 
      getUserLocation(setUserLocation, setLocationError, map, socket), 60000);
    return () => clearInterval(locationInterval);
  }, [socket, map]);

  // Set up socket listeners
  useEffect(() => {
    return setupSocketListeners(socket, map, setUserLocation, loadUserPin, setShowPinForm);
  }, [socket, map]);

  // Set up markers
  useEffect(() => {
    setupAdvancedMarkers(map, userLocation, userPin, markers, setMarkers, setSelectedPin);
    return () => {
      if (markers.home) markers.home.map = null;
      if (markers.pin) markers.pin.map = null;
    };
  }, [map, userLocation, userPin]);

  // Update marker positions
  useEffect(() => {
    updateMarkerPositions(markers, userLocation, userPin);
  }, [userLocation, userPin, markers]);

  return (
    <div className="w-full h-full">
      {locationError && (
        <div className="absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{locationError}</p>
        </div>
      )}

      <GoogleMap
        center={userLocation}
        zoom={14}
        mapContainerClassName="w-full h-full"
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
          disableDefaultUI: false,
          clickableIcons: false,
          zoomControl: true,
          streetViewControl: true
        }}
        onLoad={setMap}
      >
        {selectedPin && (
          <InfoWindow
            position={{
              lat: selectedPin.location.coordinates[1],
              lng: selectedPin.location.coordinates[0]
            }}
            onCloseClick={() => setSelectedPin(null)}
          >
            <div className="p-4">
              <h3 className="font-bold text-lg">{selectedPin.title}</h3>
              <p className="mt-2">{selectedPin.description}</p>
              {selectedPin.user !== user?._id && (
                <button
                  onClick={() => startChat(selectedPin.user)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chat with Sitter
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {showPinForm && (
        <Modal 
          isOpen={showPinForm} 
          onClose={() => setShowPinForm(false)}
        >
          <PinForm onClose={() => setShowPinForm(false)} />
        </Modal>
      )}
    </div>
  );
};

export default MapComponent;