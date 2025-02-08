import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { Plus, Hash, MessageCircle } from 'lucide-react';

const RoomList = ({ onRoomSelect, activeRoomId, onCreateRoom }) => {
    const [rooms, setRooms] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.emit('get_rooms');

        // Listen for rooms list
        socket.on('rooms_list', (roomsList) => {
            setRooms(roomsList);
        });

        // Listen for room updates
        socket.on('room_created', (newRoom) => {
            setRooms(prev => [...prev, newRoom]);
        });

        socket.on('room_joined', (room) => {
            setRooms(prev => {
                if (!prev.find(r => r._id === room._id)) {
                    return [...prev, room];
                }
                return prev;
            });
        });

        return () => {
            socket.off('rooms_list');
            socket.off('room_created');
            socket.off('room_joined');
        };
    }, [socket]);

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-medium">Chats</h3>
                <button 
                    onClick={() => onCreateRoom()}
                    className="p-1 hover:bg-cream-surface rounded"
                >
                    <Plus className="h-5 w-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {rooms.map(room => (
                    <div
                        key={room._id}
                        onClick={() => onRoomSelect(room._id)}
                        className={`flex items-center p-3 cursor-pointer hover:bg-cream-50 
                            ${activeRoomId === room._id ? 'bg-cream-100' : ''}`}
                    >
                        {room.type === 'group' ? 
                            <Hash className="h-4 w-4 mr-2" /> : 
                            <MessageCircle className="h-4 w-4 mr-2" />
                        }
                        <div className="flex-1">
                            <p className="font-medium">{room.name}</p>
                            {room.lastMessage && (
                                <p className="text-sm text-gray-500 truncate">
                                    {room.lastMessage.content}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomList;