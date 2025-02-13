import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const MapComponent = () => {
    const { user, isSitter } = useAuth();
    const { socket } = useSocket();
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userPin, setUserPin] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);
    const [isCreatingPin, setIsCreatingPin] = useState(false);
    const [newPinLocation, setNewPinLocation] = useState(null);
    const [pinForm, setPinForm] = useState({
        title: '',
        description: '',
        services: []
    });

    // Socket event listeners
    useEffect(() => {
        if (socket) {
            // Listen for center map events
            socket.on('center_map', (location) => {
                setUserLocation(location);
                map?.panTo(location);
            });

            // Listen for pin creation mode toggle
            socket.on('toggle_pin_creation', ({ isCreating }) => {
                setIsCreatingPin(isCreating);
                if (!isCreating) {
                    setNewPinLocation(null);
                    setSelectedPin(null);
                }
            });

            // Listen for pin created events
            socket.on('pin_created', () => {
                loadUserPin();
            });

            return () => {
                socket.off('center_map');
                socket.off('toggle_pin_creation');
                socket.off('pin_created');
            };
        }
    }, [socket, map]);

    // Helper function to get auth config
    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });

    // Load user pin function
    const loadUserPin = async () => {
        if (user?._id) {
            try {
                const response = await axios.get(
                    `${BACKEND_URL}/api/location-pins/search`,
                    {
                        params: { userId: user._id },
                        ...getAuthConfig()
                    }
                );
                if (response.data.length > 0) {
                    setUserPin(response.data[0]);
                }
            } catch (error) {
                console.error('Error loading user pin:', error);
                if (error.response?.status === 403) {
                    console.log('Authentication error - please try logging in again');
                }
            }
        }
    };

    // Load initial user pin
    useEffect(() => {
        loadUserPin();
    }, [user]);

    // Get initial user location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setUserLocation(location);
                if (socket) {
                    socket.emit('share_location', location);
                }
            },
            (error) => {
                console.error('Location error:', error);
                alert('Unable to get your location. Please check your browser settings.');
            }
        );
    }, [socket]);

    // Handle map click for pin creation
    const handleMapClick = (event) => {
        if (isCreatingPin && isSitter()) {
            const clickedLocation = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            };
            setNewPinLocation(clickedLocation);
            setSelectedPin({
                location: {
                    coordinates: {
                        latitude: clickedLocation.lat,
                        longitude: clickedLocation.lng
                    }
                },
                isNew: true
            });
        }
    };

    // Create pin
    const createPin = async () => {
        if (!newPinLocation || !isSitter()) return;

        try {
            const pinData = {
                latitude: newPinLocation.lat,
                longitude: newPinLocation.lng,
                title: pinForm.title || `${user.username}'s Pet Sitting Location`,
                description: pinForm.description || "Available for pet sitting services"
            };

            const response = await axios.post(
                `${BACKEND_URL}/api/location-pins/create`,
                pinData,
                getAuthConfig()
            );
            
            setUserPin(response.data);
            setNewPinLocation(null);
            setSelectedPin(null);
            setIsCreatingPin(false);
            setPinForm({ title: '', description: '', services: [] });

            if (socket) {
                socket.emit('pin_created');
                socket.emit('share_location', {
                    lat: pinData.latitude,
                    lng: pinData.longitude
                });
            }
        } catch (error) {
            console.error('Pin creation error:', error);
            if (error.response?.status === 403) {
                alert('Please log in again to create a pin');
            } else {
                alert(error.response?.data?.message || 'Error creating pin');
            }
        }
    };

    // Start chat with pin owner
    const startChat = (pinOwner) => {
        if (socket) {
            socket.emit('start_private_chat', { targetUserId: pinOwner });
        }
    };

    return (
        <div className="w-full h-full">
            <GoogleMap
                center={userLocation}
                zoom={14}
                mapContainerClassName="w-full h-full"
                options={{
                    mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
                    disableDefaultUI: false,
                    clickableIcons: false
                }}
                onClick={handleMapClick}
                onLoad={setMap}
            >
                {/* User Location Marker */}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            url: '🏠',
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                    />
                )}

                {/* User's Existing Pin */}
                {userPin && (
                    <Marker
                        position={{
                            lat: userPin.location.coordinates.latitude,
                            lng: userPin.location.coordinates.longitude
                        }}
                        onClick={() => setSelectedPin(userPin)}
                        icon={{
                            url: '🐾',
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                    />
                )}

                {/* New Pin Being Created */}
                {newPinLocation && (
                    <Marker
                        position={newPinLocation}
                        icon={{
                            url: '📍',
                            scaledSize: new window.google.maps.Size(30, 30)
                        }}
                    />
                )}

                {/* Info Window for Selected Pin */}
                {selectedPin && (
                    <InfoWindow
                        position={{
                            lat: selectedPin.location.coordinates.latitude,
                            lng: selectedPin.location.coordinates.longitude
                        }}
                        onCloseClick={() => {
                            setSelectedPin(null);
                            if (selectedPin.isNew) {
                                setNewPinLocation(null);
                            }
                        }}
                    >
                        <div className="p-4">
                            {selectedPin.isNew ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Pin Title"
                                        className="w-full p-2 border rounded"
                                        value={pinForm.title}
                                        onChange={(e) => setPinForm(prev => ({
                                            ...prev,
                                            title: e.target.value
                                        }))}
                                    />
                                    <textarea
                                        placeholder="Description"
                                        className="w-full p-2 border rounded"
                                        value={pinForm.description}
                                        onChange={(e) => setPinForm(prev => ({
                                            ...prev,
                                            description: e.target.value
                                        }))}
                                    />
                                    <button
                                        onClick={createPin}
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Create Pin
                                    </button>
                                </div>
                            ) : (
                                <div>
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
                            )}
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default MapComponent;