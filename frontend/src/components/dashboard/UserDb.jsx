import React, { useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Profile from '../Profile/Profile';
import Matching from '../Matching/Matching';

function UserDb() {
  const [activeComponent, setActiveComponent] = useState('Find a Match');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'Dashboard':
        // For this example, Dashboard will show the matching component
        return <Matching />;
      case 'Edit Profile':
        return <Profile />;
      case 'Find a Match':
        return <Matching />;
      case 'Chats':
        return <Chat />;
      default:
        return <Matching />;
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar onMenuClick={setActiveComponent} />
      <main className="flex-1 overflow-y-auto">
        {renderComponent()}
      </main>
    </div>
  );
}

export default UserDb;