import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const { socket, username } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('users_list', (usersList) => {
            // gets rid of the current user from the total list
            setUsers(usersList.filter(user => user.username !== username));
        });

        return () => {
            socket.off('users_list');
        };
    }, [socket, username]);

    const startPrivateChat = (userId) => {
        socket.emit('start_private_chat', { targetUserId: userId });
    };

    return (
        <div className="p-4">
            <h3 className="font-medium mb-4">Online Users</h3>
            <div className="space-y-2">
                {users.map(user => (
                    <div 
                        key={user.id} 
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                {user.username[0].toUpperCase()}
                            </div>
                            <span>{user.username}</span>
                        </div>
                        <button 
                            onClick={() => startPrivateChat(user.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Chat
                        </button>
                    </div>
                ))}
                {users.length === 0 && (
                    <p className="text-gray-500 text-center">No other users online</p>
                )}
            </div>
        </div>
    );
};

export default UserList;