import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const User = () => {
    const navigate = useNavigate();

    // ✅ All required states
    const [authType, setAuthType] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ✅ Toggle between login and signup
    const toggleAuthType = () => {
        setAuthType((prev) => (prev === 'login' ? 'signup' : 'login'));
        setError('');
        setSuccess('');
    };

    // ✅ Update form values
    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    // ✅ Submit form to backend
    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(`${authType} successful (mock)!`);
    
        console.log(`${authType} successful with:`, formData);
    
        // ⏩ Simulate a short delay before navigation (optional)
        setTimeout(() => {
            navigate('/user/dashboard');
        }, 500);
    };
    

    return (
        <form
        className="w-3/4 max-w-md bg-white p-8 shadow-xl rounded-xl"
        onSubmit={handleSubmit}
        >
        <h2 className="text-3xl font-bold mb-6 text-center capitalize">
            {authType} as User
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

        {authType === 'signup' && (
            <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
            <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
            />
            </div>
        )}

        <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
            <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
            />
        </div>

        <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
            />
        </div>

        <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
            {authType === 'login' ? 'Login' : 'Create Account'}
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
            {authType === 'login' ? (
            <>
                Don't have an account?{' '}
                <button onClick={toggleAuthType} type="button" className="text-blue-600 underline">
                Create one
                </button>
            </>
            ) : (
            <>
                Already have an account?{' '}
                <button onClick={toggleAuthType} type="button" className="text-blue-600 underline">
                Login
                </button>
            </>
            )}
        </p>
        </form>
    );
};

export default User;
