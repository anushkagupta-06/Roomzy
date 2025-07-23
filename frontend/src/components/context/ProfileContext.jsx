// context/ProfileContext.js
import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [bio, setBio] = useState('');

  return (
    <ProfileContext.Provider value={{ bio, setBio }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
