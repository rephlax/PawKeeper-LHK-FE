import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

const ChatInvitations = () => {
    const [invitations, setInvitations] = useState([]);
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('chat_invitation', (invitation) => {
            setInvitations(prev => [...prev, invitation]);
        });

        // Cleanup
        return () => {
            if (socket) {
                socket.off('chat_invitation');
            }
        };
    }, [socket]);

    const acceptInvitation = (invitation) => {
        if (!socket) return;
        
        socket.emit('join_room', invitation.roomId);
        setInvitations(prev => 
            prev.filter(inv => inv.roomId !== invitation.roomId)
        );
    };

    if (invitations.length === 0) return null;

    return (
        <div className="p-2">
            {invitations.map((invitation, index) => (
                <div key={index} className="border p-2 rounded mb-2 flex justify-between items-center bg-blue-50">
                    <span className="text-sm">Chat invitation from {invitation.invitedBy}</span>
                    <button 
                        onClick={() => acceptInvitation(invitation)}
                        className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                        Accept
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ChatInvitations;