import React from 'react';
import './Sidebar.css';

function Sidebar({ chatRooms, selectedRoomId, onSelectRoom, onNewChat }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <button className="new-chat-button" onClick={onNewChat}>
                    + 새 채팅
                </button>
            </div>
            <ul className="chat-list">
                {chatRooms.map(room => (
                    <li
                        key={room.id}
                        className={`chat-list-item ${room.id === selectedRoomId ? 'active' : ''}`}
                        onClick={() => onSelectRoom(room.id)}
                    >
                        {room.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;