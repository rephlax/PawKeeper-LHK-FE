import React, { useState, useRef, useEffect } from 'react';
import { 
  GoogleMap, 
  InfoWindow,
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
    const [map, setMap] = useState(null);
    const markersRef = useRef({});

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const autocompleteRef = useRef(null);

    // Handle markers when map or results change
    useEffect(() => {
        if (!map || !window.google) return;

        // Clear existing markers
        Object.values(markersRef.current).forEach(marker => marker.setMap(null));
        markersRef.current = {};

        // Add search location marker
        if (searchLocation) {
            try {
                const userMarker = new window.google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: searchLocation,
                    title: 'Search Location',
                    content: new window.google.maps.marker.PinElement({
                        scale: 1.2,
                        background: '#FFBD80', // cream-500
                        glyphColor: '#FFFFFF',
                        glyph: "📍"
                    }).element
                });

                markersRef.current['search'] = userMarker;
            } catch (error) {
                console.error('Error creating search marker:', error);
            }
        }

        // Add result markers
        results.forEach(pin => {
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
    }, [map, results, searchLocation]);

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setSearchLocation({ lat, lng });
            if (map) {
                map.panTo({ lat, lng });
                map.setZoom(14);
            }
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

    const mapOptions = {
        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="flex flex-col gap-6 p-6 bg-cream-50/50">
            <h2 className="text-2xl font-bold text-cream-800">Find Pet Sitters Near You</h2>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 
                          bg-cream-100/80 rounded-lg backdrop-blur-sm border border-cream-300 shadow-cream">
                <div className="flex-grow">
                    <Autocomplete
                        onLoad={(ref) => autocompleteRef.current = ref}
                        onPlaceChanged={handlePlaceSelect}
                    >
                        <input
                            type="text"
                            placeholder="Enter your location..."
                            className="w-full px-4 py-2 bg-cream-50 border border-cream-300 rounded-lg 
                                   focus:outline-none focus:ring-2 focus:ring-cream-500 
                                   placeholder:text-cream-600 text-cream-800"
                        />
                    </Autocomplete>
                </div>
                <button 
                    onClick={handleLocationSearch}
                    className="px-4 py-2 text-cream-800 bg-cream-200 rounded-lg 
                             hover:bg-cream-300 transition-colors duration-200 
                             border border-cream-300 shadow-cream"
                >
                    Search Area
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Map Container */}
                <div className="md:col-span-2 rounded-lg overflow-hidden border border-cream-300 shadow-cream">
                    <GoogleMap
                        mapContainerStyle={{ height: '600px', width: '100%' }}
                        zoom={10}
                        center={searchLocation || { lat: 40.7128, lng: -74.0060 }}
                        options={mapOptions}
                        onLoad={map => setMap(map)}
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
                                    <p className="text-sm text-cream-600">
                                        {(selectedPin.distance / 1000).toFixed(2)} km away
                                    </p>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>

                {/* Results List */}
                <div className="bg-cream-50/80 p-4 rounded-lg border border-cream-300 shadow-cream 
                              backdrop-blur-sm max-h-[600px] overflow-y-auto">
                    <h3 className="text-lg font-semibold text-cream-800 mb-4">Search Results</h3>
                    <div className="space-y-4">
                        {results.map(pin => (
                            <div 
                                key={pin._id} 
                                className="p-4 bg-cream-100/80 rounded-lg cursor-pointer 
                                         hover:bg-cream-200/80 transition-colors
                                         border border-cream-300"
                                onClick={() => setSelectedPin(pin)}
                            >
                                <h4 className="font-medium text-cream-800">{pin.title}</h4>
                                <p className="text-sm text-cream-700 mt-1">
                                    Services: {pin.services.join(', ')}
                                </p>
                                <p className="text-sm text-cream-600 mt-1">
                                    {(pin.distance / 1000).toFixed(2)} km away
                                </p>
                                {selectedPin?._id === pin._id && user && selectedPin.user !== user._id && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartChat();
                                        }}
                                        className="mt-2 px-3 py-1 text-cream-700 bg-cream-200 
                                                 hover:bg-cream-300 rounded-md transition-colors 
                                                 text-sm border border-cream-300"
                                    >
                                        Start Chat
                                    </button>
                                )}
                            </div>
                        ))}
                        {results.length === 0 && (
                            <p className="text-cream-600 text-center">
                                No pet sitters found in this area
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PinSearch;