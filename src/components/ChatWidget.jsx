import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Users, MessageCircle } from 'lucide-react';
import MessageInput from './MessageInput';
import Messages from './Messages';
import UserList from './UserList';
import RoomList from './RoomList';
import CreateRoomModal from './CreateRoomModal';
import ChatInvitations from './ChatInvitations';
import { useSocket } from '../context/SocketContext';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [showUserList, setShowUserList] = useState(false);
    const [showCreateRoom, setShowCreateRoom] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('room_joined', (room) => {
            console.log('Joined room:', room);
            setActiveRoom(room._id);
            setShowUserList(false);
        });

        socket.on('room_invitation', (invitation) => {
            console.log('Received room invitation:', invitation);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        return () => {
            socket.off('room_joined');
            socket.off('room_invitation');
            socket.off('error');
        };
    }, [socket]);

    const handleCreateRoom = (roomData) => {
        if (socket) {
            socket.emit('create_room', roomData);
        }
    };

    const handleRoomSelect = (roomId) => {
        if (socket) {
            socket.emit('join_room', roomId);
            setActiveRoom(roomId);
        }
    };

    const handleLeaveRoom = () => {
        if (socket && activeRoom) {
            socket.emit('leave_room', activeRoom);
            setActiveRoom(null);
        }
    };

    return (
        <div className="fixed bottom-14 right-4 z-50" style={{ maxHeight: '600px' }}>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="cursor-pointer bg-cream-background text-cream-text p-4 rounded-full hover:bg-cream-surface shadow-lg w-15 h-15 flex items-center justify-center"
                >
                    <MessageSquare className="h-10 w-10" />
                </button>
            ) : (
                <div className="bg-cream-background rounded-lg shadow-xl flex flex-col border-2 border-cream-accent/50 p-4" 
                     style={{ width: '320px', height: '480px' }}>
                    <div className="bg-cream-background text-cream-text flex justify-between items-center rounded-t-lg">
                        <h3 className="font-medium text-lg cursor-default" style={{ paddingLeft: '6px' }}>
                            {activeRoom ? 'Chat' : 'Chats'}
                        </h3>
                        <div className="flex gap-2">
                            {!activeRoom && (
                                <>
                                    <button 
                                        onClick={() => setShowUserList(!showUserList)}
                                        className="cursor-pointer hover:bg-cream-surface p-1 rounded"
                                        title={showUserList ? "Show Chats" : "Show Users"}
                                    >
                                        {showUserList ? 
                                            <MessageCircle className="h-5 w-5" /> : 
                                            <Users className="h-5 w-5" />
                                        }
                                    </button>
                                </>
                            )}
                            <button 
                                onClick={() => {
                                    if (activeRoom) {
                                        handleLeaveRoom();
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className="cursor-pointer hover:bg-cream-surface p-1 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <ChatInvitations onAccept={handleRoomSelect} />

                    <div className="flex-1 overflow-hidden">
                        {activeRoom ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-hidden">
                                    <Messages roomId={activeRoom} />
                                </div>
                                <div className="p-4 border-t">
                                    <MessageInput roomId={activeRoom} />
                                </div>
                            </div>
                        ) : showUserList ? (
                            <UserList />
                        ) : (
                            <RoomList 
                                onRoomSelect={handleRoomSelect}
                                activeRoomId={activeRoom}
                                onCreateRoom={() => setShowCreateRoom(true)}
                            />
                        )}
                    </div>
                </div>
            )}

            {showCreateRoom && (
                <CreateRoomModal 
                    onClose={() => setShowCreateRoom(false)}
                    onCreateRoom={handleCreateRoom}
                />
            )}
        </div>
    );
};

export default ChatWidget;