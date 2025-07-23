import React, { useState, useEffect, useRef } from 'react';

const RoomSuggestDialog = ({ match, onClose, onApprove }) => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const overlayRef = useRef();

    const suggestedRooms = [
        `Room A3 (Window, near gym)`,
        `Room B5 (Quiet corner)`,
        `Room C1 (Next to cafeteria)`
    ];

    // ✨ Close on outside click
    const handleClickOutside = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleSubmit = () => {
        if (!selectedRoom) return;
        alert(`Request sent to ${match.name} for ${selectedRoom}`);
        setTimeout(() => {
            onApprove({
                ...match,
                approvedRoom: selectedRoom,
            });
            onClose();
        }, 1000);
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleClickOutside}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative animate-fade-in">
                <h2 className="text-2xl font-bold text-pink-600 mb-4">Suggest a Room for {match.name}</h2>
                <p className="text-gray-600 text-sm mb-4">AI-recommended rooms based on mutual preferences:</p>

                <div className="space-y-3">
                    {suggestedRooms.map((room, index) => (
                        <label key={index} className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-pink-50 transition">
                            <input
                                type="radio"
                                name="room"
                                value={room}
                                checked={selectedRoom === room}
                                onChange={() => setSelectedRoom(room)}
                                className="accent-pink-500"
                            />
                            <span className="text-gray-800">{room}</span>
                        </label>
                    ))}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={!selectedRoom}
                    >
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomSuggestDialog;
