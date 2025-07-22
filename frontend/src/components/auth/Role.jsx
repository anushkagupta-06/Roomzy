import React from 'react';
import { useNavigate } from 'react-router-dom';

const Role = () => {
    const navigate = useNavigate();

    const handleSelect = (role) => {
        navigate(`/auth/${role}`);
    };

    return (
        <div className="flex w-screen h-screen overflow-hidden">
            {/* Left Side */}
            <div className="w-1/2 h-full bg-gradient-to-br from-red-300 to-pink-300 text-white flex justify-center items-center">
                <div className="flex flex-col items-center">
                    <img
                        src="https://app.roomie.com/_next/static/media/RoomImage.fdb7ed6a.svg"
                        alt="Login Visual"
                        className="h-60 w-auto object-contain mb-6"
                    />
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button
                            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100"
                            onClick={() => handleSelect('user')}
                        >
                            User Login
                        </button>
                        <button
                            className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100"
                            onClick={() => handleSelect('admin')}
                        >
                            Admin Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side (empty but sized) */}
            <div className="w-1/2 h-full bg-white" />
        </div>
    );
};

export default Role;
