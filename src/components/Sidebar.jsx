import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Search, Home, User } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

const Sidebar = () => {
    const { user, isMapOpen, isSitter } = useAuth();
    const { socket } = useSocket();
    const [isCreatingPin, setIsCreatingPin] = useState(false);
    const autocompleteRef = useRef(null);

    // Debug logging
    useEffect(() => {
        console.log('Sidebar - Current user:', user);
        console.log('Sidebar - Sitter status:', user?.sitter);
    }, [user]);

    // Socket event listeners
    useEffect(() => {
        if (socket) {
            socket.on('pin_created', () => {
                setIsCreatingPin(false);
            });

            return () => {
                socket.off('pin_created');
            };
        }
    }, [socket]);

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

    const MapControls = () => {
        console.log('MapControls - Rendering with sitter status:', user?.sitter);

        return (
            <div className="space-y-6 p-4">
                <h2 className="text-xl font-semibold mb-6">Map Controls</h2>
                
                {/* Current Location */}
                <div className="space-y-2">
                    <button 
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const location = {
                                        lat: position.coords.latitude,
                                        lng: position.coords.longitude
                                    };
                                    if (socket) {
                                        socket.emit('center_map', location);
                                    }
                                },
                                (error) => {
                                    console.error('Location error:', error);
                                    alert('Unable to get your location. Please check your browser settings.');
                                }
                            );
                        }}
                        className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
                    >
                        <Compass className="h-5 w-5" />
                        <span>Find My Location</span>
                    </button>
                </div>

                {/* Search Location */}
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

                {/* Create Pin (Only for sitters) */}
                {isSitter() && (
                    <div className="space-y-2">
                        <button 
                            onClick={() => {
                                console.log('Create Pin clicked - current sitter status:', user.sitter);
                                setIsCreatingPin(!isCreatingPin);
                                if (socket) {
                                    socket.emit('toggle_pin_creation', { 
                                        isCreating: !isCreatingPin 
                                    });
                                }
                            }}
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

                {/* Debug info */}
                <div className="mt-8 p-3 text-sm text-gray-500 border-t">
                    <p>Debug Info:</p>
                    <p>User logged in: {user ? 'Yes' : 'No'}</p>
                    <p>Sitter status: {user?.sitter ? 'Yes' : 'No'}</p>
                    <p>Socket connected: {socket ? 'Yes' : 'No'}</p>
                </div>
            </div>
        );
    };

    const RegularSidebar = () => (
        <div className="space-y-6 p-4">
            <h2 className="text-xl font-semibold mb-6">Navigation</h2>
            <nav className="space-y-2">
                <Link 
                    to="/" 
                    className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
                >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                </Link>
                
                {user && (
                    <Link 
                        to={`/users/user/${user._id}`}
                        className="flex items-center space-x-2 w-full p-3 text-left transition-colors hover:bg-cream-100 rounded-lg"
                    >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                    </Link>
                )}
            </nav>
        </div>
    );

    return isMapOpen ? <MapControls /> : <RegularSidebar />;
};

export default Sidebar;