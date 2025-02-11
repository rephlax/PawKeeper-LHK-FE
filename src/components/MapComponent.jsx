import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const MapComponent = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPins, setNearbyPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const autocompleteRef = useRef(null);

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

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (map) {
            map.panTo(location);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
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
      }
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <Autocomplete
          onLoad={ref => autocompleteRef.current = ref}
          onPlaceChanged={handlePlaceSelect}
        >
          <input
            type="text"
            placeholder="Search location..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </Autocomplete>
        <button
          onClick={handleGetCurrentLocation}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Current Location
        </button>
      </div>

      <div className="relative">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={userLocation || defaultCenter}
          zoom={12}
          onLoad={map => setMap(map)}
        >
          {userLocation && (
            <Marker 
              position={userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
            />
          )}

          {nearbyPins.map(pin => (
            <Marker
              key={pin._id}
              position={{
                lat: pin.location.coordinates.latitude,
                lng: pin.location.coordinates.longitude
              }}
              onClick={() => setSelectedPin(pin)}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
              }}
            />
          ))}

          {selectedPin && (
            <InfoWindow
              position={{
                lat: selectedPin.location.coordinates.latitude,
                lng: selectedPin.location.coordinates.longitude
              }}
              onCloseClick={() => setSelectedPin(null)}
            >
              <div className="p-4 max-w-sm">
                <h3 className="text-lg font-bold mb-2">{selectedPin.title}</h3>
                <p className="text-gray-600 mb-2">{selectedPin.description}</p>
                {selectedPin.services && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Services:</span> {selectedPin.services.join(', ')}
                  </p>
                )}
                {selectedPin.hourlyRate && (
                  <p className="text-sm mb-2">
                    <span className="font-semibold">Rate:</span> ${selectedPin.hourlyRate}/hr
                  </p>
                )}
                {user?.sitter && selectedPin.user === user._id && (
                  <Link 
                    to="/sitter/create-pin"
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Edit My Pin
                  </Link>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {user?.sitter && (
          <div className="absolute bottom-4 right-4">
            <Link 
              to="/sitter/create-pin"
              className="px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition-colors"
            >
              {nearbyPins.some(pin => pin.user === user._id) 
                ? 'Edit My Pin' 
                : 'Add My Location'
              }
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;