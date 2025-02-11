import React, { useState, useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  Marker, 
  Autocomplete, 
  useJsApiLoader 
} from '@react-google-maps/api';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

const PinSearch = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [searchLocation, setSearchLocation] = useState(null);
    const [results, setResults] = useState([]);
    const [selectedPin, setSelectedPin] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const autocompleteRef = useRef(null);

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setSearchLocation({ lat, lng });
        }
    };
    
    const handleLocationSearch = async () => {
        if (!searchLocation) return;

        try {
            const response = await axios.get('/api/location-pins/search', {
                params: {
                    latitude: searchLocation.lat,
                    longitude: searchLocation.lng
                }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Search error', error);
        }
    };

    const handleStartChat = () => {
        if (socket && selectedPin) {
            const targetUserId = selectedPin.user;
            
            socket.emit('start_private_chat', { targetUserId });
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="pin-search">
            <h2>Find Pet Sitters Near You</h2>
            
            <div className="search-container">
                <Autocomplete
                    onLoad={(ref) => autocompleteRef.current = ref}
                    onPlaceChanged={handlePlaceSelect}
                >
                    <input
                        type="text"
                        placeholder="Enter your location"
                        className="location-input"
                    />
                </Autocomplete>
                <button onClick={handleLocationSearch}>Search</button>
            </div>

            <div className="map-results-container">
                <GoogleMap
                    mapContainerStyle={{ height: '500px', width: '100%' }}
                    zoom={10}
                    center={searchLocation || { lat: 40.7128, lng: -74.0060 }}
                >
                    {searchLocation && (
                        <Marker 
                            position={searchLocation}
                            icon={{
                                url: '/path/to/current-location-icon.png',
                                scaledSize: new window.google.maps.Size(35, 35)
                            }}
                        />
                    )}

                    {results.map(pin => (
                        <Marker
                            key={pin._id}
                            position={{
                                lat: pin.location.coordinates.latitude,
                                lng: pin.location.coordinates.longitude
                            }}
                            onClick={() => setSelectedPin(pin)}
                        />
                    ))}
                </GoogleMap>

                <div className="results-list">
                    {results.map(pin => (
                        <div 
                            key={pin._id} 
                            className="pin-result"
                            onClick={() => setSelectedPin(pin)}
                        >
                            <h3>{pin.title}</h3>
                            <p>Services: {pin.services.join(', ')}</p>
                            <p>Distance: {(pin.distance / 1000).toFixed(2)} km</p>
                        </div>
                    ))}
                </div>

                {selectedPin && (
                    <div className="pin-details">
                        <h3>{selectedPin.title}</h3>
                        <p>Description: {selectedPin.description}</p>
                        <p>Services: {selectedPin.services.join(', ')}</p>
                        <p>Availability: {selectedPin.availability}</p>
                        <p>Hourly Rate: ${selectedPin.hourlyRate}</p>
                        
                        {user && selectedPin.user !== user._id && (
                            <button 
                                onClick={handleStartChat}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
                            >
                                Start Chat
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PinSearch;