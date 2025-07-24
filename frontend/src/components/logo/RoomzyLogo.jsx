import React from 'react';

const RoomzyLogo = () => {
    return (
        <div className="flex items-center gap-3">
            {/* Icon Circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 flex items-center justify-center shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5L12 3l9 7.5M4.5 10.5V20h15v-9.5"
                    />
                </svg>
            </div>

            {/* Brand Name */}
            <h1 className="text-4xl font-bold font-serif tracking-wider text-rose-600 drop-shadow-sm">
                Roomzy
            </h1>
        </div>
    );
};

export default RoomzyLogo;
