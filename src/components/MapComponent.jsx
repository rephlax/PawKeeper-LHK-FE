// import React, { useState, useEffect, useRef } from 'react';
// import { GoogleMap, Marker, InfoWindow, Autocomplete } from '@react-google-maps/api';
// import { useSocket } from '../context/SocketContext';
// import { useAuth } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useTranslation } from "react-i18next";

// const MapComponent = () => {
//     const { t } = useTranslation();
//     const { user, socket } = useAuth();
//     const [map, setMap] = useState(null);
//     const [userLocation, setUserLocation] = useState(null);
//     const [userPin, setUserPin] = useState(null);
//     const [selectedPin, setSelectedPin] = useState(null);

//     // Get current location on component mount
//     useEffect(() => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           setUserLocation(location);
//         },
//         (error) => {
//           console.error('Location error:', error);
//         }
//       );
//     }, []);

//     // Create pin at current location
//     const createPin = async () => {
//       try {
//         const response = await axios.post('/api/location-pins/create', {
//           latitude: userLocation.lat,
//           longitude: userLocation.lng,
//           title: `${user.username}'s Pet Sitting Location`,
//           description: "Available for pet sitting services"
//         });

//         setUserPin(response.data);
//       } catch (error) {
//         console.error('Pin creation error:', error);
//       }
//     };

//     // Start chat with pin owner
//     const startChat = (pinOwner) => {
//       if (socket) {
//         socket.emit('start_private_chat', { targetUserId: pinOwner });
//       }
//     };

//     return (
//       <GoogleMap
//         center={userLocation}
//         zoom={12}
//         options={{
//           mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
//           disableDefaultUI: true
//         }}
//       >
//         {/* User's location marker */}
//         {userLocation && (
//           <Marker
//             position={userLocation}
//             icon="🏠"
//           />
//         )}

//         {/* User's pin */}
//         {userPin && (
//           <Marker
//             position={{
//               lat: userPin.location.coordinates.latitude,
//               lng: userPin.location.coordinates.longitude
//             }}
//             onClick={() => setSelectedPin(userPin)}
//             icon="🐾"
//           />
//         )}

//         {/* Pin creation button */}
//         {!userPin && userLocation && (
//           <button onClick={createPin}>
//             {t('map.createpin')}
//           </button>
//         )}

//         {/* Selected pin info window */}
//         {selectedPin && (
//           <InfoWindow
//             position={{
//               lat: selectedPin.location.coordinates.latitude,
//               lng: selectedPin.location.coordinates.longitude
//             }}
//           >
//             <div>
//               <h3>{selectedPin.title}</h3>
//               <p>{selectedPin.description}</p>
//               {selectedPin.user !== user._id && (
//                 <button onClick={() => startChat(selectedPin.user)}>
//                 {t('map.startchat')}
//                 </button>
//               )}
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
//     );
//   };

//   export default MapComponent;
