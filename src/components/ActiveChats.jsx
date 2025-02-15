import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import defaultUser from '../assets/defaultUser.png';
import { useTranslation } from 'react-i18next';

const ActiveChats = () => {
  const { t } = useTranslation();
  const [activeRooms, setActiveRooms] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('get_active_rooms');

    socket.on('active_rooms', rooms => {
      console.log('Received active rooms:', rooms);
      setActiveRooms(rooms);
    });

    return () => {
      socket?.off('active_rooms');
    };
  }, [socket]);

  const handleChatClick = roomId => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">{t('chat.active')}</h3>
      <div className="space-y-2">
        {activeRooms.map(room => (
          <div
            key={room._id}
            onClick={() => handleChatClick(room._id)}
            className="flex justify-between items-center p-2 hover:bg-cream-50 rounded border cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {room.participants.map(participant => {
                if (participant._id !== socket?.user?._id) {
                  return (
                    <div key={participant._id} className="relative">
                      <img
                        src={participant.profilePicture || defaultUser}
                        alt={participant.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${
                          room.isActive ? 'bg-green-500' : 'bg-gray-300'
                        } border-2 border-white`}
                      />
                    </div>
                  );
                }
                return null;
              })}
              <div>
                <p className="font-medium">
                  {room.participants
                    .filter(p => p._id !== socket?.user?._id)
                    .map(p => p.username)
                    .join(', ')}
                </p>
                {room.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">{room.lastMessage.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {activeRooms.length === 0 && (
          <p className="text-cream-text text-center">{t('chat.noactive')}</p>
        )}
      </div>
    </div>
  );
};

export default ActiveChats;
