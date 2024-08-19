import React from 'react';

const ChatList = ({ chats, onSelectChat }) => {

  return (
    <div className="overflow-y-auto h-[33.8rem] p-3">
    {chats.map(chat => {
  
      return (
        <div key={chat._id} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md" onClick={() => onSelectChat(chat._id)}>
          <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
            <img src="/public/images/chat-group.jpg" className="w-full h-full object-cover rounded-full " />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold nanumPen">{chat.concierto.artistaPrincipal.nombre}</h2>
            <p className="text-gray-600">{chat.concierto.ubicacion}</p>
          </div>
        </div>
      );
    })}
  </div>
  );
};

export default ChatList;