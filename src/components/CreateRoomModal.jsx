import { useState } from 'react';
import { X } from 'lucide-react';

const CreateRoomModal = ({ onClose, onCreateRoom }) => {
    const [roomName, setRoomName] = useState('');
    const [type, setType] = useState('direct');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!roomName.trim()) return;

        onCreateRoom({
            name: roomName.trim(),
            type,
            participants: []
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Create New Chat</h3>
                    <button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Chat Name
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter chat name..."
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="direct">Direct Message</option>
                            <option value="group">Group Chat</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;