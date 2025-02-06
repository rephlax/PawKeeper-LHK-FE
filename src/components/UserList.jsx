import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { socket, isUserOnline, user } = useSocket();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (!socket) return;

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/users/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.filter(u => u._id !== user?._id));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

        const events = ['users_online', 'user_connected', 'user_disconnected'];
        events.forEach(event => {
            socket.on(event, fetchUsers);
        });

        socket.emit('get_online_users');

        return () => {
            events.forEach(event => {
                socket.off(event);
            });
        };
    }, [socket, user?._id]);

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
                            <div className="relative">
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
                                {/* Online status indicator */}
                                <div 
                                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                                        isUserOnline(user._id) 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                    } border-2 border-white`}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium">{user.username}</p>
                                    <span className={`text-xs ${
                                        isUserOnline(user._id) 
                                            ? 'text-green-500' 
                                            : 'text-gray-400'
                                    }`}>
                                        {isUserOnline(user._id) ? 'Online' : 'Offline'}
                                    </span>
                                </div>
                                {user.sitter && <p className="text-xs text-gray-500">Pet Sitter</p>}
                            </div>
                        </div>
                        <button 
                            onClick={() => startPrivateChat(user._id)}
                            className={`px-3 py-1 rounded ${
                                isUserOnline(user._id)
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                            disabled={!isUserOnline(user._id)}
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