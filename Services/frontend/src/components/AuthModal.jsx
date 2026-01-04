import React, { useState, useEffect } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../app/context/AuthContext';
import { toast } from 'react-hot-toast';

import { useConfig } from "../app/context/ConfigContext";

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const { config } = useConfig();
    const [mode, setMode] = useState(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    // Reset when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setFormData({ firstName: '', lastName: '', email: '', password: '' });
            setErrors({});
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.password) newErrors.password = "Password is required";

        if (mode === 'signup') {
            if (!formData.firstName) newErrors.firstName = "First Name is required";
            if (!formData.lastName) newErrors.lastName = "Last Name is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);

        try {
            if (mode === 'login') {
                const response = await axios.post(`${config.authServiceUrl}/signin`, {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    login(response.data.token);
                    toast.success("Welcome back!");
                    onClose();
                } else {
                    toast.error(response.data.message || "Login failed");
                }
            } else {
                const response = await axios.post(`${config.authServiceUrl}/signup`, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    toast.success("Account created! Please sign in.");
                    setMode('login'); // Switch to login after signup
                } else {
                    toast.error(response.data.message || "Registration failed");
                }
            }
        } catch (error) {
            console.error("Auth Error:", error);
            const msg = error.response?.data?.message || "Something went wrong";
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">

                {/* Decorative Header */}
                <div className="h-2 bg-gradient-to-r from-primary to-accent"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <FiX size={20} />
                </button>

                <div className="p-8">
                    {/* Title */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-gray-900 mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {mode === 'login'
                                ? 'Enter your details to continue'
                                : 'Join us and start shopping today'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Signup Fields: Name */}
                        {mode === 'signup' && (
                            <div className="flex gap-4 animate-fade-in">
                                <div className="space-y-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="First Name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.firstName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm`}
                                        />
                                        <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                                    </div>
                                    {errors.firstName && <p className="text-xs text-red-500 px-1">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Last Name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.lastName ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm`}
                                        />
                                        <FiUser className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                                    </div>
                                    {errors.lastName && <p className="text-xs text-red-500 px-1">{errors.lastName}</p>}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm`}
                                />
                                <FiMail className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 px-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm`}
                                />
                                <FiLock className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 px-1">{errors.password}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-black text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Toggle */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="ml-2 font-bold text-primary hover:text-primary-dark hover:underline transition-colors"
                            >
                                {mode === 'login' ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
