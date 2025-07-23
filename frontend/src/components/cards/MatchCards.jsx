import React from 'react';

const MatchCard = ({ match }) => {
    const { name, age, occupation, compatibility, room, imageUrl, reason } = match;

    const getCompatibilityColor = (score) => {
        if (score >= 85) return 'bg-green-100 text-green-800';
        if (score >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="bg-card rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <div className="p-6">
            <div className="flex items-center space-x-4">
            <img className="w-20 h-20 rounded-full object-cover" src={imageUrl} alt={name} />
            <div>
                <p className="text-xl font-bold text-text-primary">{name}, {age}</p>
                <p className="text-text-secondary">{occupation}</p>
            </div>
            <div className={`ml-auto px-3 py-1 text-sm font-semibold rounded-full ${getCompatibilityColor(compatibility)}`}>
                {compatibility}% Match
            </div>
            </div>
            <div className="mt-4 border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-800">Why it's a good match:</h4>
            <p className="text-sm text-gray-600 mt-1">{reason}</p>
            <div className="mt-4">
                <p className="text-sm text-gray-800"><span className="font-semibold">Suggested Room:</span> {room}</p>
            </div>
            </div>
            <div className="mt-6 flex justify-end">
            <button className="px-5 py-2 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary">
                Start a Chat
            </button>
            </div>
        </div>
        </div>
    );
};

export default MatchCard;