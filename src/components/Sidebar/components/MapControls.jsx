import React, { useRef } from 'react';
import { Compass, MapPin, Search } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';
import { handleLocationRequest } from '../utils/locationHandlers';
import { handlePinCreation } from '../utils/pinHandlers';

const MapControls = ({ user, socket, isCreatingPin, setIsCreatingPin }) => {
  const autocompleteRef = useRef(null);

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current?.getPlace();
    if (place?.geometry?.location && socket) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      socket.emit('center_map', location);
    }
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold mb-6">Map Controls</h2>
      
      <div className="space-y-2">
        <button 
          onClick={() => handleLocationRequest(socket)}
          className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
        >
          <Compass className="h-5 w-5" />
          <span>Find My Location</span>
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 p-3">
          <Search className="h-5 w-5" />
          <Autocomplete
            onLoad={ref => (autocompleteRef.current = ref)}
            onPlaceChanged={handlePlaceSelect}
          >
            <input
              type="text"
              placeholder="Search location..."
              className="w-full p-2 border rounded"
            />
          </Autocomplete>
        </div>
      </div>

      {user?.sitter && (
        <div className="space-y-2">
          <button 
            onClick={() => handlePinCreation(isCreatingPin, setIsCreatingPin, socket)}
            className={`flex items-center space-x-2 w-full p-3 text-left transition-colors rounded-lg
              ${isCreatingPin ? 'bg-cream-200 text-cream-900' : 'hover:bg-cream-100'}`}
          >
            <MapPin className="h-5 w-5" />
            <span>{isCreatingPin ? 'Cancel Pin Form' : 'Create Location Pin'}</span>
          </button>
          {isCreatingPin && (
            <p className="text-sm text-cream-600 px-3">
              Fill out your sitter details to create a pin at your current location
            </p>
          )}
        </div>
      )}

      <div className="mt-8 p-3 text-sm text-gray-500 border-t">
        <p>Debug Info:</p>
        <p>User logged in: {user ? 'Yes' : 'No'}</p>
        <p>Sitter status: {user?.sitter ? 'Yes' : 'No'}</p>
        <p>Socket connected: {socket ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};
export default MapControls;