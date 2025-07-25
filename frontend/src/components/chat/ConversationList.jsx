import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConversationList = () => {
  const [matchedUsers, setMatchedUsers] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/match`, {
            withCredentials: true
          }); 
        setMatchedUsers(res.data.matchedUsers);
      } catch (err) {
        console.error("Error fetching matched users", err);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="w-1/3 border-r overflow-y-auto">
      {matchedUsers.map((user) => (
        <div key={user._id} className="p-4 border-b cursor-pointer hover:bg-gray-100">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;