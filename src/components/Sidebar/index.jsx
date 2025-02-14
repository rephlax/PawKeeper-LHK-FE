import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { MapControls, RegularSidebar } from "./components";

const Sidebar = () => {
  const { user, isMapOpen } = useAuth();
  const { socket } = useSocket();
  const [isCreatingPin, setIsCreatingPin] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("pin_created", () => {
        setIsCreatingPin(false);
      });

      return () => {
        socket.off("pin_created");
      };
    }
  }, [socket]);

  return isMapOpen ? (
    <MapControls
      user={user}
      socket={socket}
      isCreatingPin={isCreatingPin}
      setIsCreatingPin={setIsCreatingPin}
    />
  ) : (
    <RegularSidebar user={user} />
  );
};

export default Sidebar;
