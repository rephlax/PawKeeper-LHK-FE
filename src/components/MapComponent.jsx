import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005';

const MapComponent = () => {
    const { user, socket } = useAuth();
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

    // Load existing user pin
    useEffect(() => {
        const loadUserPin = async () => {
            if (user?._id) {
                try {
                    const response = await axios.get(`${BACKEND_URL}/api/location-pins/search`, {
                        params: {
                            userId: user._id
                        }
                    });
                    if (response.data.length > 0) {
                        setUserPin(response.data[0]);
                    }
                } catch (error) {
                    console.error('Error loading user pin:', error);
                }
            }
        };
        loadUserPin();
    }, [user]);

    // Event handler for centering map
    useEffect(() => {
        const handleCenterMap = (event) => {
            const location = event.detail;
            setUserLocation(location);
            map?.panTo(location);
        };

        window.addEventListener('centerMap', handleCenterMap);
        return () => window.removeEventListener('centerMap', handleCenterMap);
    }, [map]);

    // Event handler for pin creation toggle
    useEffect(() => {
        const handleTogglePinCreation = (event) => {
            setIsCreatingPin(event.detail.isCreating);
            if (!event.detail.isCreating) {
                setNewPinLocation(null);
                setSelectedPin(null);
            }
        };

        window.addEventListener('togglePinCreation', handleTogglePinCreation);
        return () => window.removeEventListener('togglePinCreation', handleTogglePinCreation);
    }, []);

    // Handle map click for pin creation
    const handleMapClick = (event) => {
        if (isCreatingPin && user?.sitter) {
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
        if (!newPinLocation || !user?.sitter) return;

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
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                }
            );
            
            setUserPin(response.data);
            setNewPinLocation(null);
            setSelectedPin(null);
            setIsCreatingPin(false);
            setPinForm({ title: '', description: '', services: [] });

            // Notify other users through socket
            if (socket) {
                socket.emit('share_location', {
                    lat: pinData.latitude,
                    lng: pinData.longitude
                });
            }

            // Dispatch event to update sidebar
            window.dispatchEvent(new CustomEvent('pinCreated'));

        } catch (error) {
            console.error('Pin creation error:', error);
            alert(error.response?.data?.message || 'Error creating pin');
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