import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// localhost wont work with this api

const MapComponent = () => {
    const { user, isSitter } = useAuth();
    const { socket } = useSocket();
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [userPin, setUserPin] = useState(null);
    const [selectedPin, setSelectedPin] = useState(null);
    const [showPinForm, setShowPinForm] = useState(false);
    const [pinForm, setPinForm] = useState({
        title: '',
        description: '',
        services: ['Dog Walking', 'Cat Sitting'],
        availability: 'Part Time',
        hourlyRate: 0
    });

    useEffect(() => {
        if (socket) {
            socket.on('center_map', (location) => {
                setUserLocation(location);
                map?.panTo(location);
            });

            socket.on('toggle_pin_creation', ({ isCreating }) => {
                setShowPinForm(isCreating);
            });

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

    const getAuthConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });

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
            }
        }
    };

    useEffect(() => {
        loadUserPin();
    }, [user]);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPinForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createPin = async () => {
        if (!userLocation || !isSitter()) {
            alert('Must be a sitter and have location enabled to create a pin');
            return;
        }

        try {
            const pinData = {
                latitude: userLocation.lat,
                longitude: userLocation.lng,
                title: pinForm.title || `${user.username}'s Pet Sitting Location`,
                description: pinForm.description || "Available for pet sitting services",
                services: pinForm.services,
                availability: pinForm.availability,
                hourlyRate: pinForm.hourlyRate
            };

            const response = await axios.post(
                `${BACKEND_URL}/api/location-pins/create`,
                pinData,
                getAuthConfig()
            );
            
            setUserPin(response.data);
            setShowPinForm(false);
            setPinForm({
                title: '',
                description: '',
                services: ['Dog Walking', 'Cat Sitting'],
                availability: 'Part Time',
                hourlyRate: 0
            });

            if (socket) {
                socket.emit('pin_created');
                socket.emit('share_location', {
                    lat: userLocation.lat,
                    lng: userLocation.lng
                });
            }

            alert('Pin created successfully at your current location!');
        } catch (error) {
            console.error('Pin creation error:', error);
            alert(error.response?.data?.message || 'Error creating pin');
        }
    };

    const startChat = (pinOwner) => {
        if (socket) {
            socket.emit('start_private_chat', { targetUserId: pinOwner });
        }
    };

    return (
        <div className="w-full h-full flex">
            <div className={showPinForm ? "w-2/3" : "w-full"}>
                <GoogleMap
                    center={userLocation}
                    zoom={14}
                    mapContainerClassName="w-full h-full"
                    options={{
                        mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
                        disableDefaultUI: false,
                        clickableIcons: false
                    }}
                    onLoad={setMap}
                >
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{
                                url: '🏠',
                                scaledSize: new window.google.maps.Size(30, 30)
                            }}
                        />
                    )}

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

                    {selectedPin && !showPinForm && (
                        <InfoWindow
                            position={{
                                lat: selectedPin.location.coordinates.latitude,
                                lng: selectedPin.location.coordinates.longitude
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
            </div>

            {showPinForm && (
                <div className="w-1/3 p-4 bg-white overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Create Sitter Pin</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={pinForm.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                placeholder={`${user?.username}'s Pet Sitting Location`}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Description</label>
                            <textarea
                                name="description"
                                value={pinForm.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows="3"
                                placeholder="Describe your services..."
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Availability</label>
                            <select
                                name="availability"
                                value={pinForm.availability}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Weekends Only">Weekends Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1">Hourly Rate ($)</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={pinForm.hourlyRate}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                min="0"
                            />
                        </div>
                        <button
                            onClick={createPin}
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Create Pin at My Location
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapComponent;