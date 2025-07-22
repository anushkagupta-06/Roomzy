import React from 'react';

const Profile = () => {
    return (
        <div className="p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Your Profile</h1>
        <div className="p-8 bg-card rounded-xl shadow-md space-y-6">
            <div className="flex items-center space-x-6">
            <img
                className="w-24 h-24 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"
                alt="User profile"
            />
            <div>
                <h2 className="text-2xl font-semibold text-text-primary">Jessica Williams</h2>
                <p className="text-text-secondary">UX Designer at TechCorp</p>
            </div>
            </div>
            <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Your Bio</label>
            <textarea
                id="bio"
                rows="4"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                defaultValue="Lover of quiet mornings, good books, and clean spaces. I enjoy occasional outings but also value my alone time. Looking for a roommate who is respectful and communicative."
            ></textarea>
            </div>
            <div>
            <label htmlFor="work-hours" className="block text-sm font-medium text-gray-700">Typical Work Hours</label>
            <input
                type="text"
                id="work-hours"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2"
                defaultValue="9 AM - 6 PM, mostly from home"
            />
            </div>
            <div className="flex justify-end">
            <button className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Save Changes
            </button>
            </div>
        </div>
        </div>
    );
};

export default Profile;