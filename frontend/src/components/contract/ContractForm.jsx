import React from 'react';

const ContractForm = ({ roommate }) => {
    return (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Contract Form</h4>
            <p className="text-sm text-gray-600">This is a basic placeholder for the contract between you and <span className="font-medium">{roommate.name}</span>.</p>
            <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Download as PDF
            </button>
        </div>
    );
};

export default ContractForm;
