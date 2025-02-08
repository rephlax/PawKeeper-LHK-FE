import { useState } from "react";
import { useSocket } from "../context/SocketContext";

const MessageInput = ({ roomId }) => {
    const [message, setMessage] = useState("");
    const { socket } = useSocket();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !socket || !roomId) return;

        try {
            console.log('Sending message to room:', roomId);
            socket.emit("send_message", {
                roomId,
                content: message.trim()
            });
            setMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cream-500"
            />
            <button
                type="submit"
                disabled={!message.trim() || !socket}
                className="bg-cream-background text-cream-text px-4 py-2 rounded-lg hover:bg-cream-surface transition-colors disabled:opacity-50"
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;