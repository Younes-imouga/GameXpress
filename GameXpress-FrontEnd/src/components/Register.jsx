import { useState } from "react";
import React from "react";
import axios from 'axios';
import axiosInstance from "../axiosConfig";

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axiosInstance.post('admin/register', formData);
            console.log('Registration successful:', response.data);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });
        } catch (err) {
            setError(err.response?.data?.errors?.name || err.response?.data?.errors?.password || err.response?.data?.errors?.email || 'Registration failed. Please try again.');
            console.error('Registration error:', err.response?.data || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md text-white">
                    <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">Create an Account</h2>
                    <form>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm">Username</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-sm">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-1 text-sm">Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                        </div>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 font-semibold py-2 px-4 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 font-semibold py-2 px-4 rounded-lg mb-6" role="alert">
                                <span className="block sm:inline">Registration successful!</span>
                            </div>
                        )}

                        <button onClick={handleSubmit} type="submit" disabled={loading} className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                            {loading ? 'Processing...' : 'Sign Up'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-400">
                        Already have an account? <a href="/login" className="text-green-400 hover:underline">Sign In</a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Register;