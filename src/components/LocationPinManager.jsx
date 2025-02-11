import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const LocationPinManager = () => {
    const [location, setLocation] = useState(null);
    const mapRef = useRef(null);

    // Handle map click to set location
    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setLocation({ lat, lng });
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    // Improved map loading handler
    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    return (
        <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            zoom={10}
            center={location || { lat: 40.7128, lng: -74.0060 }}
            onClick={handleMapClick}
            onLoad={onMapLoad}
            options={{
                mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true
            }}
        >
            {location && (
                <Marker 
                    position={location} 
                    draggable={true}
                    onDragEnd={(e) => {
                        const newLat = e.latLng.lat();
                        const newLng = e.latLng.lng();
                        setLocation({ lat: newLat, lng: newLng });
                        setFormData(prev => ({
                            ...prev,
                            latitude: newLat,
                            longitude: newLng
                        }));
                    }}
                />
            )}
        </GoogleMap>
    );
};