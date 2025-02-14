export const handlePinCreation = (isCreatingPin, setIsCreatingPin, socket) => {
  console.log("Pin creation handler called with:", {
    isCreatingPin,
    socket: !!socket,
  });

  try {
    const newState = !isCreatingPin;
    setIsCreatingPin(newState);

    if (socket) {
      console.log("Emitting toggle_pin_creation:", { isCreating: newState });
      socket.emit("toggle_pin_creation", {
        isCreating: newState,
        show: !newState,
      });
    } else {
      console.warn("Socket not available for pin creation");
    }
  } catch (error) {
    console.error("Error in handlePinCreation:", error);
  }
};
