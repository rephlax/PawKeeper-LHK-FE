import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Search, Home, User } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

const Sidebar = () => {
    const { user, isMapOpen } = useAuth();
    const [isCreatingPin, setIsCreatingPin] = useState(false);
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const handlePinCreated = () => {
            setIsCreatingPin(false);
        };

        window.addEventListener('pinCreated', handlePinCreated);
        return () => window.removeEventListener('pinCreated', handlePinCreated);
    }, []);

    const handlePlaceSelect = () => {
        const place = autocompleteRef.current?.getPlace();
        if (place?.geometry?.location) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            window.dispatchEvent(new CustomEvent('centerMap', { detail: location }));
        }
    };

    const MapControls = () => (
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
                                window.dispatchEvent(new CustomEvent('centerMap', { detail: location }));
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
            {user?.sitter && (
                <div className="space-y-2">
                    <button 
                        onClick={() => {
                            setIsCreatingPin(!isCreatingPin);
                            window.dispatchEvent(new CustomEvent('togglePinCreation', { 
                                detail: { isCreating: !isCreatingPin }
                            }));
                        }}
                        className={`flex items-center space-x-2 w-full p-3 text-left transition-colors rounded-lg
                            ${isCreatingPin ? 'bg-cream-200 text-cream-900' : 'hover:bg-cream-100'}`}
                    >
                        <MapPin className="h-5 w-5" />
                        <span>{isCreatingPin ? 'Cancel Pin Creation' : 'Create New Pin'}</span>
                    </button>
                    {isCreatingPin && (
                        <p className="text-sm text-cream-600 px-3">
                            Click anywhere on the map to place your pin
                        </p>
                    )}
                </div>
            )}
        </div>
    );

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