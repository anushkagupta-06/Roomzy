import React, { useState } from 'react';
import RoomSuggestDialog from '../RoomSuggestDialog';
import MyRoommate from '../MyRoommate';

const MatchCard = ({ match }) => {
    const [showDialog, setShowDialog] = useState(false);
    const [approvedMatch, setApprovedMatch] = useState(null);

    const getCompatibilityColor = (score) => {
        if (score >= 85) return 'bg-green-100 text-green-800';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    if (approvedMatch) {
        return <MyRoommate roommate={approvedMatch} />;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="p-6">
                <div className="flex items-center space-x-4">
                    <img className="w-20 h-20 rounded-full object-cover" src={match.imageUrl} alt={match.name} />
                    <div>
                        <p className="text-xl font-bold">{match.name}, {match.age}</p>
                        <p className="text-gray-600">{match.occupation}</p>
                    </div>
                    <div className={`ml-auto px-3 py-1 text-sm font-semibold rounded-full ${getCompatibilityColor(match.compatibility)}`}>
                        {match.compatibility}% Match
                    </div>
                </div>
                <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-800">Why it's a good match:</h4>
                    <p className="text-sm text-gray-600 mt-1">{match.reason}</p>
                    <p className="text-sm mt-2"><span className="font-semibold">Suggested Room:</span> {match.room}</p>
                </div>
                <div className="mt-6 flex justify-between">
                    <button
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
                        onClick={() => setShowDialog(true)}
                    >
                        Select Match
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Start Chat
                    </button>
                </div>
            </div>

            {showDialog && (
                <RoomSuggestDialog
                    match={match}
                    onClose={() => setShowDialog(false)}
                    onApprove={(approvedMatch) => setApprovedMatch(approvedMatch)}
                />
            )}
        </div>
    );
};

export default MatchCard;
