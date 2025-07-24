import React from 'react';
import { motion } from 'framer-motion';
import {
  UserCircleIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/solid';
import RoomzyLogo from '../logo/RoomzyLogo';

const Sidebar = ({ onMenuClick }) => {
  const menuItems = [
    { name: 'Edit Profile', icon: UserCircleIcon },
    { name: 'Find a Match', icon: UserGroupIcon },
    { name: 'Chats', icon: ChatBubbleLeftRightIcon },
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col w-64 h-screen px-6 py-8 
        bg-gradient-to-b from-blue-200 to-blue-300 
        dark:from-gray-800 dark:to-gray-800 
        shadow-2xl text-gray-800 dark:text-white 
        rounded-r-3xl transition-colors duration-300"
    >
      <h2 className="text-4xl font-extrabold dark:text-purple-200 mb-8 font-serif tracking-wide">
        <RoomzyLogo />
      </h2>

      <aside className="flex-grow">
        <ul>
          {menuItems.map((item) => (
            <motion.li
              key={item.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <button
                onClick={() => onMenuClick(item.name)}
                className="flex items-center w-full px-4 py-3 my-2 
                  bg-white dark:bg-white
                  text-purple-900
                  rounded-xl shadow-sm hover:bg-purple-100 dark:hover:bg-purple-700 
                  hover:shadow-md transition duration-300"
              >
                <item.icon className="w-6 h-6 text-purple-500" />
                <span className="ml-4 text-md font-medium">{item.name}</span>
              </button>
            </motion.li>
          ))}
        </ul>
      </aside>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-auto text-sm text-rose-700 dark:text-purple-300 text-center"
      >
        ❤️ Find Your Vibe
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
