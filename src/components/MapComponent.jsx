import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userLocation);
          
          if (socket) {
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
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, [socket, user]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={10}
        onLoad={map => setMap(map)}
      >
        {userLocation && (
          <Marker 
            position={userLocation}
            icon={{
              url: '/path/to/current-location-icon.png',
              scaledSize: new window.google.maps.Size(35, 35)
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
            <div className="p-2">
              <h3 className="font-bold">{selectedPin.title}</h3>
              <p>{selectedPin.description}</p>
              {selectedPin.services && (
                <p>Services: {selectedPin.services.join(', ')}</p>
              )}
              {selectedPin.hourlyRate && (
                <p>Rate: ${selectedPin.hourlyRate}/hr</p>
              )}
              {user?.sitter && selectedPin.user === user._id && (
                <Link 
                  to="/sitter/create-pin"
                  className="text-blue-500 hover:text-blue-600"
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
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            {nearbyPins.some(pin => pin.user === user._id) 
              ? 'Edit My Pin' 
              : 'Add My Location'
            }
          </Link>
        </div>
      )}
    </div>
  );
};

export default MapComponent;