import React, { useEffect, useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { motion } from 'framer-motion';

const LOCAL_STORAGE_KEY = 'hostelProfileData';

const Profile = () => {
  const { bio } = useProfile();

  const [profile, setProfile] = useState({
    workHours: '',
    sleepTime: '',
    noisePreference: '',
    cleanliness: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    alert('✅ Preferences saved!');
  };

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-500 dark:text-pink-300 mb-6 cursor-default">
        Your Profile
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl space-y-8 border border-pink-100 dark:border-pink-300/10"
      >
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <img
            className="w-24 h-24 rounded-full object-cover ring-4 ring-pink-200"
            src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop"
            alt="User profile"
          />
          <div>
            <h2 className="text-2xl font-semibold text-pink-800 dark:text-pink-300 cursor-default">
              Jessica Williams
            </h2>
          </div>
        </div>

        {/* AI Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🧠 About You (AI generated)
          </label>
          <textarea
            id="bio"
            rows="4"
            className="block w-full rounded-xl border-gray-300 dark:border-gray-700 shadow-sm focus:ring-pink-400 focus:border-pink-400 sm:text-sm p-3 bg-pink-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            value={bio || 'No bio yet. Please take the AI survey 💬'}
            readOnly
          />
        </div>

        {/* Editable Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: '💼 Study / Work Hours', id: 'work-hours', field: 'workHours', placeholder: 'e.g. 9 AM - 6 PM' },
            { label: '🌙 Sleep Schedule', id: 'sleep-time', field: 'sleepTime', placeholder: 'e.g. 11 PM - 7 AM' }
          ].map(({ label, id, field, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <input
                type="text"
                id={id}
                value={profile[field]}
                onChange={handleChange(field)}
                className="block w-full rounded-xl border-gray-300 dark:border-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                placeholder={placeholder}
              />
            </div>
          ))}

          {/* Select Fields */}
          {[
            {
              label: '🔊 Noise Preference',
              id: 'noise-tolerance',
              field: 'noisePreference',
              options: ['Quiet room preferred', 'Can tolerate some noise', 'Loves lively environment']
            },
            {
              label: '🧽 Cleanliness Level',
              id: 'cleanliness',
              field: 'cleanliness',
              options: ['Very neat and organized', 'Somewhat clean', 'Messy but manageable']
            }
          ].map(({ label, id, field, options }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
              <select
                id={id}
                value={profile[field]}
                onChange={handleChange(field)}
                className="block w-full rounded-xl border-gray-300 dark:border-gray-700 shadow-sm focus:border-pink-400 focus:ring-pink-400 sm:text-sm p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              >
                <option value="">Select preference</option>
                {options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 dark:bg-purple-600 dark:hover:bg-purple-700"
          >
            Save Preferences
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
