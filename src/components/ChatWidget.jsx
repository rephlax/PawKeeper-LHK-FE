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
                    <div className=" bg-cream-background text-cream-text flex justify-between items-center rounded-t-lg">
                        <h3 className="font-medium text-lg cursor-default" style={{ paddingLeft: '6px' }}>Chat</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowUserList(!showUserList)}
                                className="cursor-pointer hover:bg-cream-surface p-1 rounded"
                            >
                                <Users className="h-5 w-5" />
                            </button>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="cursor-pointer hover:bg-cream-surface p-1 rounded"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div className="border-b border-cream-accent relative">
                        <div className="absolute top-full left-0 right-0 h-2 bg-gradient-to-b from-cream-800/20 to-transparent">
                        </div>
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
                                <p className="text-cream-text text-center">
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