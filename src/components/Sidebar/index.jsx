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
			console.log("Setting up sidebar socket listeners");

			const handlePinCreated = () => {
				console.log("Sidebar: Received pin_created event");
				setIsCreatingPin(false);
			};

			socket.on("pin_created", handlePinCreated);

			return () => {
				console.log("Cleaning up sidebar socket listeners");
				socket.off("pin_created", handlePinCreated);
			};
		}
	}, [socket]);

	console.log("Sidebar render:", {
		isMapOpen,
		isCreatingPin,
		hasSocket: !!socket,
		hasUser: !!user,
	});

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
