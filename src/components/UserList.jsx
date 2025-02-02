import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5005'

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/api/users`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.filter(user => user._id !== socket.user._id));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [socket]);

    const startPrivateChat = (userId) => {
        socket.emit('start_private_chat', { targetUserId: userId });
    };

    return (
        <div className="p-4">
            <h3 className="font-medium mb-4">Available Users</h3>
            <div className="space-y-2">
                {users.map(user => (
                    <div 
                        key={user._id} 
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border"
                    >
                        <div className="flex items-center gap-2">
                            {user.profilePicture ? (
                                <img 
                                    src={user.profilePicture} 
                                    alt={user.username} 
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    {user.username[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-medium">{user.username}</p>
                                {user.sitter && <p className="text-xs text-gray-500">Pet Sitter</p>}
                            </div>
                        </div>
                        <button 
                            onClick={() => startPrivateChat(user._id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Chat
                        </button>
                    </div>
                ))}
                {users.length === 0 && (
                    <p className="text-gray-500 text-center">No users available</p>
                )}
            </div>
        </div>
    );
};

export default UserList;