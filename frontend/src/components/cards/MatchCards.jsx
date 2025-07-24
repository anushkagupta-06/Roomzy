import React, { useState } from 'react'
import RoomSuggestDialog from '../room dialog/RoomSuggestDialog'
import RoommateContract from '../roommate/RoommateContract'

const MatchCard = ({ match }) => {
    const [showDialog, setShowDialog] = useState(false)
    const [approvedMatch, setApprovedMatch] = useState(null)
    const [button, setButton] = useState("Select Match")

    const getCompatibilityColor = (score) => {
        if (score >= 85) return 'bg-green-100 text-green-800 dark:bg-green-300 dark:text-green-900'
        if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-300 dark:text-yellow-900'
        return 'bg-red-100 text-red-800 dark:bg-red-300 dark:text-red-900'
    }      

    if (approvedMatch) {
       // return <RoommateContract roommate={approvedMatch} />
    }

    return (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
                <div className="flex items-center space-x-4">
                <img
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-300 dark:border-gray-600"
                    src={match.imageUrl}
                    alt={match.name}
                />
                <div>
                    <p className="text-default font-bold text-gray-800 dark:text-gray-100">{match.name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{match.occupation}</p>
                </div>
                <div
                    className={`ml-auto px-3 py-1 text-sm font-semibold rounded-xl ${getCompatibilityColor(
                    match.compatibility
                    )} dark:border dark:border-opacity-10`}
                >
                    {match.compatibility}% Match
                </div>
                </div>
        
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">Why it's a good match:</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{match.reason}</p>
                </div>
        
                <div className="mt-6 flex justify-between">
                <button
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition-all duration-300"
                    onClick={() => setShowDialog(true)}
                >
                    {button}
                </button>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg transition-all duration-300">
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
        )
        
    }

export default MatchCard
