import React from 'react';
import { UserCircleIcon, UserGroupIcon, ChatBubbleLeftRightIcon, HomeIcon } from '@heroicons/react/24/solid';
import RoomzyLogo from '../RoomzyLogo';


const Sidebar = ({ onMenuClick }) => {
    const menuItems = [
        { name: 'Edit Profile', icon: UserCircleIcon },
        { name: 'Find a Match', icon: UserGroupIcon },
        { name: 'Chats', icon: ChatBubbleLeftRightIcon },
    ];

    return (
        <div className="flex flex-col w-64 h-screen px-6 py-8 bg-gradient-to-b from-pink-100 to-pink-200 shadow-xl text-gray-800">
            <h2 className="text-4xl font-extrabold text-pink-800 mb-8 font-serif tracking-wide"><RoomzyLogo /></h2>
            <aside className="flex-grow">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <button
                                onClick={() => onMenuClick(item.name)}
                                className="flex items-center w-full px-4 py-3 my-2 text-pink-900 bg-white rounded-xl shadow-sm hover:bg-pink-100 hover:shadow-md transition duration-300"
                            >
                                <item.icon className="w-6 h-6 text-pink-500" />
                                <span className="ml-4 text-md font-medium">{item.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="mt-auto text-sm text-pink-700 text-center">
                ❤️ Find Your Vibe
            </div>
        </div>
    );
};

export default Sidebar;
