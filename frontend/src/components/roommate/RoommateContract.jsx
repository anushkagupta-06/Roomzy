import React, { useState } from 'react';
import ContractForm from '../contract/ContractForm';

const RoommateContract = ({ roommate }) => {
    const [showContract, setShowContract] = useState(false);

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-pink-600 mb-4">Your Roommate</h3>
            <div className="flex items-center space-x-4">
                <img src={roommate.imageUrl} alt={roommate.name} className="w-20 h-20 rounded-full object-cover" />
                <div>
                    <p className="text-lg font-semibold">{roommate.name}, {roommate.age}</p>
                    <p className="text-gray-600">{roommate.occupation}</p>
                </div>
            </div>
            <button
                onClick={() => setShowContract(true)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                Generate Contract
            </button>

            {showContract && <ContractForm roommate={roommate} />}
        </div>
    );
};

export default RoommateContract;
