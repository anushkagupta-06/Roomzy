import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  if (currentUser?._id) {
    socket.emit("join", { userId: currentUser._id });
  }

  useEffect(() => {
    // Fetch matched users from backend
    const fetchMatches = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/match`, {
          credentials: 'include'
        });
        const data = await res.json();
        setMatchedUsers(data.matchedUsers); // depends on your backend format
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMsg.trim() && currentChat) {
        socket.emit("private_message", {
            senderId: currentUser._id,
            receiverId: currentChat._id,
            content: newMsg
          });
      setMessages((prev) => [...prev, { fromSelf: true, message: newMsg }]);
      setNewMsg("");
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("private_message", (data) => {
      if (data.from === currentChat?._id) {
        setMessages((prev) => [...prev, { fromSelf: false, message: data.message }]);
      }
    });

    return () => socket.off("receive_message");
  }, [socket, currentChat]);

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Matched Users</h2>
        {matchedUsers.map((user) => (
          <div
            key={user._id}
            className={`p-2 cursor-pointer rounded ${currentChat?._id === user._id ? 'bg-blue-200' : ''}`}
            onClick={async () => {
                setCurrentChat(user);
                setMessages([]);
              
                try {
                  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/history/${user._id}`, {
                    credentials: 'include'
                  });
                  const data = await res.json();
              
                  const formatted = data?.data?.map(msg => ({
                    fromSelf: msg.sender === user._id ? false : true,
                    message: msg.content
                  }));
                  
                  setMessages(formatted);
                } catch (err) {
                  console.error("Failed to load chat history", err);
                }
              }}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col justify-between p-4">
        {currentChat ? (
          <>
            <div className="text-lg font-bold border-b pb-2 mb-2">
              Chatting with {currentChat.name}
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded max-w-[70%] ${msg.fromSelf ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-200'}`}
                >
                  {msg.message}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />

            <div className="flex">
              <input
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 border p-2 rounded-l"
                placeholder="Type a message"
              />
              <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded-r">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600 mt-10">Select a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;