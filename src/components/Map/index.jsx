import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { setupAdvancedMarkers, updateMarkerPositions } from './utils/markers';
import { DEFAULT_CENTER, getUserLocation } from './utils/location';
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
  const [mapVisible, setMapVisible] = useState(true);
  const [markers, setMarkers] = useState({
    home: null,
    pin: null,
  });

  const getAuthConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }),
    []
  );

  const loadUserPin = async () => {
    if (!user?._id) return;

    try {
      console.log('Loading pin for user:', user._id);
      const response = await axios.get(`${BACKEND_URL}/api/location-pins/search`, {
        params: { userId: user._id },
        ...getAuthConfig(),
      });

      if (response.data.length > 0) {
        setUserPin(response.data[0]);
      }
    } catch (error) {
      console.error('Error loading user pin:', error);
    }
  };

  const startChat = pinOwner => {
    if (socket) {
      socket.emit('start_private_chat', { targetUserId: pinOwner });
    }
  };

  useEffect(() => {
    loadUserPin();
  }, [user]);

  useEffect(() => {
    getUserLocation(setUserLocation, setLocationError, map, socket);
    const locationInterval = setInterval(
      () => getUserLocation(setUserLocation, setLocationError, map, socket),
      60000
    );
    return () => clearInterval(locationInterval);
  }, [socket, map]);

  useEffect(() => {
    if (!socket) {
      console.warn('Socket not available for setup');
      return;
    }

    console.log('Setting up socket listeners');

    socket.on('center_map', location => {
      console.log('Received center_map event:', location);
      if (location && location.lat && location.lng) {
        setUserLocation(location);
        map?.panTo(location);
      }
    });

    socket.on('pin_created', () => {
      console.log('Received pin_created event');
      loadUserPin();
    });

    socket.on('pin_updated', () => {
      console.log('Received pin_updated event');
      loadUserPin();
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('center_map');
      socket.off('pin_created');
      socket.off('pin_updated');
    };
  }, [socket, map]);

  useEffect(() => {
    setupAdvancedMarkers(map, userLocation, userPin, markers, setMarkers, setSelectedPin, user);
    return () => {
      if (markers.home) markers.home.map = null;
      if (markers.pin) markers.pin.map = null;
    };
  }, [map, userLocation, userPin]);

  useEffect(() => {
    updateMarkerPositions(markers, userLocation, userPin);
  }, [userLocation, userPin, markers]);

  const renderInfoWindowContent = () => {
    if (!selectedPin) return null;

    const isOwnPin = selectedPin.user === user?._id;

    // User is not a sitter clicking their home location
    if (!user?.sitter && isOwnPin) {
      return null;
    }

    // User is a sitter but hasn't registered a pin
    if (user?.sitter && isOwnPin && !userPin) {
      return (
        <div className="p-4">
          <h3 className="font-bold text-lg">Register Your Pin First</h3>
          <p className="mt-2">
            Use the sidebar "Create Location Pin" button to register your services.
          </p>
        </div>
      );
    }

    // View of other sitter's pin
    if (!isOwnPin) {
      return (
        <div className="p-4">
          <h3 className="font-bold text-lg">{selectedPin.title}</h3>
          <p className="mt-2">{selectedPin.description}</p>
          <p className="mt-1 text-gray-600">Availability: {selectedPin.availability}</p>
          <p className="mt-1 text-gray-600">Rate: ${selectedPin.hourlyRate}/hr</p>
          <button
            onClick={() => startChat(selectedPin.user)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Chat with Sitter
          </button>
        </div>
      );
    }

    // Registered sitter viewing their own pin
    return (
      <div className="p-4">
        <h3 className="font-bold text-lg">{selectedPin.title}</h3>
        <p className="mt-2">{selectedPin.description}</p>
        <p className="mt-1 text-gray-600">Availability: {selectedPin.availability}</p>
        <p className="mt-1 text-gray-600">Rate: ${selectedPin.hourlyRate}/hr</p>
        <button
          onClick={() => {
            if (socket) {
              socket.emit('toggle_pin_creation', { isCreating: true, isEditing: true });
            }
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Information
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full">
      <div className={`w-full h-full ${!mapVisible ? 'hidden' : ''}`}>
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
            streetViewControl: true,
          }}
          onLoad={setMap}
        >
          {selectedPin && (
            <InfoWindow
              position={{
                lat: selectedPin.location.coordinates[1],
                lng: selectedPin.location.coordinates[0],
              }}
              onCloseClick={() => setSelectedPin(null)}
            >
              {renderInfoWindowContent()}
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default MapComponent;
