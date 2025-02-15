import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useTranslation } from "react-i18next";

const CreateRoomModal = ({ onClose, onCreateRoom }) => {

    const { t } = useTranslation();
    const [roomName, setRoomName] = useState('');
    const [type, setType] = useState('group');
    const [users, setUsers] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const { socket } = useSocket();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/users/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.filter(user => user._id !== socket?.user?._id));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [socket, BACKEND_URL]);

    const toggleParticipant = (user) => {
        setSelectedParticipants(prev => 
            prev.some(p => p._id === user._id)
                ? prev.filter(p => p._id !== user._id)
                : [...prev, user]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!roomName.trim()) {
            alert('Please enter a room name');
            return;
        }

        if (type === 'group' && selectedParticipants.length === 0) {
            alert('Please select at least one participant for a group chat');
            return;
        }

        const roomData = {
            name: roomName,
            type,
            participants: selectedParticipants.map(p => p._id)
        };
        
        console.log('Creating room with data:', roomData);
        onCreateRoom(roomData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">{t('chat.newcreate')}</h3>
                    <button onClick={onClose}>
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                        {t('chat.name')}
                        </label>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                            placeholder="Enter chat name..."
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                        {t('chat.type')}
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="group">{t('chat.group')}</option>
                            <option value="direct">{t('chat.direct')}</option>
                        </select>
                    </div>
                    {type === 'group' && (
                        <div className="mb-4 flex-1 overflow-y-auto">
                            <label className="block text-sm font-medium mb-1">
                                {t('chat.participants')}
                            </label>
                            <div className="space-y-2">
                                {users.map(user => (
                                    <div 
                                        key={user._id} 
                                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                                            selectedParticipants.some(p => p._id === user._id) 
                                                ? 'bg-blue-100' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                        onClick={() => toggleParticipant(user)}
                                    >
                                        <div className="flex-1 flex items-center">
                                            {user.profilePicture ? (
                                                <img 
                                                    src={user.profilePicture} 
                                                    alt={user.username} 
                                                    className="w-8 h-8 rounded-full object-cover mr-2"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                                    {user.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{user.username}</p>
                                                {user.sitter && <p className="text-xs text-gray-500">Pet Sitter</p>}
                                            </div>
                                        </div>
                                        {selectedParticipants.some(p => p._id === user._id) && (
                                            <Check className="text-blue-500 h-5 w-5" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg"
                        >
                            {t('chat.cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                        >
                            {t('chat.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRoomModal;