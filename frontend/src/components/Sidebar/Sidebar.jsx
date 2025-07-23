import React from 'react';
import { UserCircleIcon, UserGroupIcon, ChatBubbleLeftRightIcon, HomeIcon } from '@heroicons/react/24/solid';

const Sidebar = ({ onMenuClick }) => {
    const menuItems = [
        { name: 'Dashboard', icon: HomeIcon },
        { name: 'Edit Profile', icon: UserCircleIcon },
        { name: 'Find a Match', icon: UserGroupIcon },
        { name: 'Chats', icon: ChatBubbleLeftRightIcon },
    ];

    return (
        <div className="flex flex-col w-64 h-screen px-4 py-8 bg-sidebar text-sidebar-text">
        <h2 className="text-3xl font-semibold text-white">HerRoomie</h2>
        <div className="flex flex-col justify-between mt-10">
            <aside>
            <ul>
                {menuItems.map((item) => (
                <li key={item.name}>
                    <button
                    onClick={() => onMenuClick(item.name)}
                    className="flex items-center w-full px-4 py-3 mt-2 text-gray-400 transition-colors duration-200 transform rounded-lg hover:bg-gray-700 hover:text-gray-200"
                    >
                    <item.icon className="w-5 h-5" />
                    <span className="mx-4 font-medium">{item.name}</span>
                    </button>
                </li>
                ))}
            </ul>
            </aside>
        </div>
        </div>
    );
};

export default Sidebar;