import React, { useState } from "react";
import axiosInstance from '../axiosConfig';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

        try {
            const response = await axiosInstance.post('/admin/login', formData);
            console.log(response.data);
            
            if (response.data.access_token) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            setFormData({ email: '', password: '' });
            console.log(response.data.user.roles[0].name);
            if (response.data.user.roles[0].name === 'super_admin') {
                window.location.href = '/admin/dashboard';
            } else if (response.data.user.roles[0].name === 'product_manager') {
                window.location.href = '/games';
            } else if (response.data.user.roles[0].name === 'user_manager') {
                window.location.href = '/user_manager/dashboard';
            } else if (response.data.user.roles[0].name === 'client') {
                window.location.href = '/client/dashboard';
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err);
            setError(err.response?.data?.message || err.response?.data?.errors.name || err.response?.data?.errors.password || err.response?.data?.errors.email || "Login failed. Please try again.");
            response.data.errors = null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md text-white">
                <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    </div>
                    <div className="mb-6">
                        <label className="block mb-1 text-sm">Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 font-semibold py-2 px-4 rounded-lg mb-6" role="alert">
                            <span>{error}</span>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className={`w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-400">
                    Don't have an account? <a href="/register" className="text-green-400 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
