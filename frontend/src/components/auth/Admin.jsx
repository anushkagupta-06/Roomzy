import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ for redirect
import axios from 'axios';

const Admin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate(); // ✅ init hook

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
        const res = await axios.post('http://localhost:5000/api/admin/login', formData);
        const token = res.data.token;

        // ✅ Store token
        localStorage.setItem('adminToken', token);

        setSuccess('Login successful');
        console.log('Admin token:', token);

        // ✅ Redirect to admin dashboard
        navigate('/admin/dashboard');

        } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <form
        className="w-3/4 max-w-md bg-white p-8 shadow-xl rounded-xl"
        onSubmit={handleSubmit}
        >
        <h2 className="text-3xl font-bold mb-6 text-center">Login as Admin</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}

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
            className="w-full bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition"
        >
            Login
        </button>
        </form>
    );
};

export default Admin;
