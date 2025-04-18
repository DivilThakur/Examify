import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Lock, Shield, ArrowRight, Mail } from 'lucide-react';

const Auth = () => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [input, setInput] = useState({ 
        email: '', 
        password: '', 
        confirmPassword: '',
        userType: 'student' 
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.email || !input.password) {
            toast.error('Please fill all fields');
            return;
        }
        if (isRegistering && input.password !== input.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);
        const endpoint = isRegistering ? 'register' : 'login';
        const url = `http://localhost:5000/api/auth/${endpoint}`;

        // Transform the data to match backend expectations
        const requestData = {
            username: input.email,
            password: input.password,
            role: input.userType
        };

        axios.post(url, requestData)
            .then((res) => {
                if (isRegistering) {
                    toast.success('Registration successful! Please login.');
                    setIsRegistering(false);
                } else {
                    // Verify that the returned role matches the selected role
                    if (res.data.role !== input.userType) {
                        toast.error(`Invalid role. This email is registered as a ${res.data.role}, not as an ${input.userType}`);
                        setIsLoading(false);
                        return;
                    }

                    // Store the token and user data separately
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('username', res.data.username);
                    localStorage.setItem('role', res.data.role);
                    
                    toast.success('Login successful');
                    navigate('/dashboard');
                }
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(`${isRegistering ? 'Registration' : 'Login'} Error:`, err.response);
                const errorMsg = err.response?.data?.message || 'An unexpected error occurred.';
                toast.error(errorMsg);
                setIsLoading(false);
            });
    };
    
    const getResetLink = (e) => {
        e.preventDefault();
        if (!input.email) {
            toast.error('Please enter your email');
            return;
        }
        setIsLoading(true);
        axios.post(`/auth/forgot-password`, { email: input.email, userType: input.userType })
            .then((res) => {
                toast.success(res.data.msg);
                setIsLoading(false);
            })
            .catch((err) => {
                toast.error(err.response.data.msg);
                setIsLoading(false);
            });
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
            <Toaster />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ duration: 0.5 }} 
                className="bg-[#111111] p-8 rounded-xl shadow-xl w-full max-w-md border border-white/5"
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {isRegistering ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-400">
                        {isRegistering ? 'Join Examify today' : 'Sign in to your account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={16} className="text-gray-400" />
                        </div>
                        <input 
                            type="email" 
                            placeholder="Email"
                            value={input.email}
                            onChange={(e) => setInput({ ...input, email: e.target.value })}
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:border-blue-500 focus:ring focus:ring-blue-500/20 placeholder-gray-500"
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-400" />
                        </div>
                        <input 
                            type="password" 
                            placeholder="Password"
                            value={input.password}
                            onChange={(e) => setInput({ ...input, password: e.target.value })}
                            className="w-full pl-10 px-4 py-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:border-blue-500 focus:ring focus:ring-blue-500/20 placeholder-gray-500"
                        />
                    </div>

                    {isRegistering && (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={16} className="text-gray-400" />
                            </div>
                            <input 
                                type="password" 
                                placeholder="Confirm Password"
                                value={input.confirmPassword}
                                onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })}
                                className="w-full pl-10 px-4 py-3 rounded-lg bg-[#0a0a0a] text-white border border-white/10 focus:border-blue-500 focus:ring focus:ring-blue-500/20 placeholder-gray-500"
                            />
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Select Role:</span>
                        <select 
                            value={input.userType} 
                            onChange={(e) => setInput({ ...input, userType: e.target.value })} 
                            className="bg-[#0a0a0a] text-white border border-white/10 px-3 py-2 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                        >
                            <option value="student">Student</option>
                            <option value="examiner">Examiner</option>
                        </select>
                    </div>

                    {!isRegistering && (
                        <p 
                            onClick={getResetLink} 
                            className="text-blue-400 text-sm cursor-pointer text-right hover:text-blue-300 transition-colors"
                        >
                            Forgot password?
                        </p>
                    )}

                    <motion.button
                        type="submit"
                        className="w-full group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-blue-500/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isLoading ? (
                            "Processing..."
                        ) : (
                            <>
                                {isRegistering ? 'Create Account' : 'Sign In'}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </motion.button>

                    <p className="text-gray-400 text-sm text-center">
                        {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                        <span 
                            onClick={() => setIsRegistering(!isRegistering)} 
                            className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors ml-1"
                        >
                            {isRegistering ? 'Sign in' : 'Sign up'}
                        </span>
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Auth;
