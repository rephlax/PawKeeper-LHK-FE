import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { MapControls, RegularSidebar } from './components';

const Sidebar = () => {
  const { user, isMapOpen } = useAuth();
  const { socket } = useSocket();
  const [isCreatingPin, setIsCreatingPin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    if (socket) {
      console.log('Setting up sidebar socket listeners');

      const handlePinCreated = () => {
        console.log('Sidebar: Received pin_created event');
        setIsCreatingPin(false);
        setIsEditing(false);
      };

      const handleTogglePinCreation = data => {
        console.log('Received toggle_pin_creation:', data);
        setIsCreatingPin(data.isCreating);
        setIsEditing(data.isEditing || false);
        if (data.pinData) {
          setEditData(data.pinData);
        }
      };

      socket.on('pin_created', handlePinCreated);
      socket.on('toggle_pin_creation', handleTogglePinCreation);

      return () => {
        console.log('Cleaning up sidebar socket listeners');
        socket.off('pin_created', handlePinCreated);
        socket.off('toggle_pin_creation', handleTogglePinCreation);
      };
    }
  }, [socket]);

  return isMapOpen ? (
    <MapControls
      user={user}
      socket={socket}
      isCreatingPin={isCreatingPin}
      setIsCreatingPin={setIsCreatingPin}
      isEditing={isEditing}
      editData={editData}
    />
  ) : (
    <RegularSidebar user={user} />
  );
};

export default Sidebar;
