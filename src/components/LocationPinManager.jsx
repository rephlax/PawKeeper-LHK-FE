import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  GoogleMap, 
  Marker, 
  Autocomplete, 
  useJsApiLoader 
} from '@react-google-maps/api';
import axios from 'axios';

const services = [
  'Dog Walking', 
  'Cat Sitting', 
  'Pet Boarding', 
  'Pet Grooming', 
  'Reptile Care', 
  'Bird Sitting'
];

const LocationPinManager = () => {
    const { user, token } = useAuth();
    const { socket } = useSocket();
    const [pin, setPin] = useState(null);
    const [location, setLocation] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        latitude: 0,
        longitude: 0,
        serviceRadius: 10,
        services: [],
        availability: 'Part Time',
        hourlyRate: 0
    });

    // Google Maps setup
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ['places']
    });

    const autocompleteRef = useRef(null);

    // Fetch existing pin
    useEffect(() => {
        const fetchUserPin = async () => {
            try {
                const response = await axios.get('/api/location-pins', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPin(response.data);
                setLocation({
                    lat: response.data.location.coordinates.latitude,
                    lng: response.data.location.coordinates.longitude
                });
            } catch (error) {
                console.log('No existing pin');
            }
        };

        if (user) fetchUserPin();
    }, [user, token]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle service selection
    const handleServiceToggle = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    // Handle location selection from autocomplete
    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place.geometry) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            
            setLocation({ lat, lng });
            setFormData(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
            }));
        }
    };

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

    // Create or update pin
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = pin ? '/api/location-pins/update' : '/api/location-pins/create';
            const method = pin ? 'put' : 'post';
            
            const response = await axios[method](endpoint, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPin(response.data);

            if (socket) {
                socket.emit('share_location', {
                    lat: formData.latitude,
                    lng: formData.longitude
                });
            }
        } catch (error) {
            console.error('Error saving pin', error);
        }
    };

    // Delete pin
    const handleDelete = async () => {
        try {
            await axios.delete('/api/location-pins/delete', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPin(null);
            setLocation(null);
        } catch (error) {
            console.error('Error deleting pin', error);
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="location-pin-manager">
            <h2>Pet Sitter Location Pin</h2>
            
            {!pin ? (
                <form onSubmit={handleSubmit} className="pin-form">
                    <div>
                        <label>Title</label>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Your Pet Sitting Service Name"
                            required
                        />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Tell us about your pet sitting services"
                            required
                        />
                    </div>

                    <div>
                        <label>Location</label>
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
                    </div>

                    <GoogleMap
                        mapContainerStyle={{ height: '400px', width: '100%' }}
                        zoom={10}
                        center={location || { lat: 40.7128, lng: -74.0060 }}
                        onClick={handleMapClick}
                    >
                        {location && (
                            <Marker 
                                position={location}
                                draggable={true}
                                onDragEnd={(e) => {
                                    const lat = e.latLng.lat();
                                    const lng = e.latLng.lng();
                                    setLocation({ lat, lng });
                                    setFormData(prev => ({
                                        ...prev,
                                        latitude: lat,
                                        longitude: lng
                                    }));
                                }}
                            />
                        )}
                    </GoogleMap>

                    <div>
                        <label>Services</label>
                        {services.map(service => (
                            <div key={service}>
                                <input
                                    type="checkbox"
                                    checked={formData.services.includes(service)}
                                    onChange={() => handleServiceToggle(service)}
                                />
                                {service}
                            </div>
                        ))}
                    </div>

                    <div>
                        <label>Availability</label>
                        <select
                            name="availability"
                            value={formData.availability}
                            onChange={handleChange}
                        >
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Weekends Only">Weekends Only</option>
                        </select>
                    </div>

                    <div>
                        <label>Hourly Rate</label>
                        <input
                            type="number"
                            name="hourlyRate"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <button type="submit">Create Pin</button>
                </form>
            ) : (
                <div className="existing-pin">
                    <h3>Your Current Pin</h3>
                    <p>Title: {pin.title}</p>
                    <p>Description: {pin.description}</p>
                    <p>Services: {pin.services.join(', ')}</p>
                    <p>Availability: {pin.availability}</p>
                    <p>Hourly Rate: ${pin.hourlyRate}</p>
                    
                    <GoogleMap
                        mapContainerStyle={{ height: '400px', width: '100%' }}
                        zoom={12}
                        center={{
                            lat: pin.location.coordinates.latitude,
                            lng: pin.location.coordinates.longitude
                        }}
                    >
                        <Marker 
                            position={{
                                lat: pin.location.coordinates.latitude,
                                lng: pin.location.coordinates.longitude
                            }}
                        />
                    </GoogleMap>

                    <button onClick={handleDelete}>Delete Pin</button>
                </div>
            )}
        </div>
    );
};

export default LocationPinManager;