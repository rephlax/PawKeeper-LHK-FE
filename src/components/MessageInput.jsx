import { useState } from "react";
import { useSocket } from "../context/SocketContext";

const MessageInput = ({ roomId }) => {
    const [message, setMessage] = useState("");
    const socket = useSocket();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || !socket || !roomId) return;

        socket.emit("send_message", {
            roomId,
            content: message.trim()
        });

        setMessage("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                disabled={!message.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                Send
            </button>
        </form>
    );
};

export default MessageInput;