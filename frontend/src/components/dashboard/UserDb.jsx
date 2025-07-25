import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Profile from '../Profile/Profile';
import Matching from '../Matching/Matching';
import { ProfileProvider } from '../context/ProfileContext';
import Chat from '../chat/Chat';

function UserDb() {
  const [activeComponent, setActiveComponent] = useState('Find a Match');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Edit Profile':
        return <Profile />;
      case 'Find a Match':
        return <Matching  />;
      case 'Chats':
        return <Chat />;
      default:
        return <Matching />;
    }
  };

  return (
    <ProfileProvider >
    <div className="flex h-screen bg-background font-sans">
      <Sidebar onMenuClick={setActiveComponent} />
      <main className="flex-1 overflow-y-auto">
        {renderComponent()}
      </main>
    </div>
    </ProfileProvider>
  );
}

export default UserDb;