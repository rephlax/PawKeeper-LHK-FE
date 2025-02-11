import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';

const MapComponent = () => {
  const { socket } = useSocket();
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPins, setNearbyPins] = useState([]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userLocation);
          
          socket.emit('share_location', userLocation, (response) => {
            if (response.error) {
              console.error('Location sharing failed');
            }
          });

          socket.emit('search_nearby_sitters', 
            { 
              lat: userLocation.lat, 
              lng: userLocation.lng, 
              radius: 10 
            }, 
            (response) => {
              if (response.sitters) {
                setNearbyPins(response.sitters);
              }
            }
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }, [socket]);

  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={userLocation || defaultCenter}
      zoom={10}
    >
      {/* User's current location marker */}
      {userLocation && (
        <Marker 
          position={userLocation}
          icon={{
            url: '/path/to/current-location-icon.png',
            scaledSize: new window.google.maps.Size(35, 35)
          }}
        />
      )}

      {/* Nearby sitter pins */}
      {nearbyPins.map(pin => (
        <Marker
          key={pin._id}
          position={{
            lat: pin.location.coordinates.latitude,
            lng: pin.location.coordinates.longitude
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;