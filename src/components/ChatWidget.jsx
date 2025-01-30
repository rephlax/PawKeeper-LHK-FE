import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Users } from 'lucide-react';
import MessageInput from './MessageInput';
import Messages from './Messages';
import UserList from './UserList';
import ChatInvitations from './ChatInvitations';
import { useSocket } from '../context/SocketContext';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [showUserList, setShowUserList] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('private_chat_started', (roomId) => {
            setActiveRoom(roomId);
            setShowUserList(false);
        });

        return () => socket.off('private_chat_started');
    }, [socket]);

    return (
        <div className="fixed bottom-16 right-4 z-50" style={{ maxHeight: '600px' }}>
            {!isOpen ? (
                <button 
                    onClick={() => setIsOpen(true)} 
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-lg"
                >
                    <MessageSquare className="h-6 w-6" />
                </button>
            ) : (
                <div className="bg-white rounded-lg shadow-xl flex flex-col" 
                     style={{ width: '320px', height: '480px' }}>
                    <div className="p-4 bg-blue-600 text-white flex justify-between items-center rounded-t-lg">
                        <h3 className="font-medium">Chat</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowUserList(!showUserList)}
                                className="hover:bg-blue-700 p-1 rounded"
                            >
                                <Users className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="hover:bg-blue-700 p-1 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="border-b">
                        <ChatInvitations />
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {showUserList ? (
                            <UserList />
                        ) : activeRoom ? (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-hidden">
                                    <Messages roomId={activeRoom} />
                                </div>
                                <div className="p-4 border-t">
                                    <MessageInput roomId={activeRoom} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full p-4">
                                <p className="text-gray-500 text-center">
                                    Click the users icon to start a chat
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;