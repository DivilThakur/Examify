    /* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Award, Clock, ArrowRight } from 'lucide-react';
import Sidebar from './Sidebar';

const Dashboard = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchExams = async () => {
            const token = localStorage.getItem('token');
            try {
                setLoading(true);
                const response = await axios.get('https://examify-1.onrender.com/api/exams', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExams(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching exams', error);
                setError('Failed to load exams. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchExams();
    }, []);
    
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Sidebar />
            
            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {role === 'examiner' ? 'Your Created Exams' : 'Available Exams'}
                            </h1>
                            <p className="text-gray-400">
                                {role === 'examiner' 
                                    ? 'Create and manage your examination content' 
                                    : 'Take available exams and track your progress'}
                            </p>
                        </div>
                        
                        {role === 'examiner' && (
                            <button 
                                onClick={() => navigate('/create-exam')}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium"
                            >
                                <Plus size={20} />
                                Create New Exam
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
                            />
                        </div>
                    ) : error ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                        >
                            <p>{error}</p>
                        </motion.div>
                    ) : exams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {exams.map((exam) => (
                                    <motion.div 
                                        key={exam._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        whileHover={{ y: -5 }}
                                        className="group bg-[#111111] rounded-xl border border-white/5 hover:border-blue-500/50 transition-colors p-6"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <h2 className="text-xl font-bold">{exam.title}</h2>
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock size={16} />
                                                <span>{exam.duration} min</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-gray-400 mb-6">
                                            <span>{exam.questions.length} Questions</span>
                                        </div>
                                        
                                        <button 
                                            onClick={() => navigate(`/exam/${exam._id}`)}
                                            className="w-full group flex items-center justify-center gap-2 px-4 py-3 bg-white/5 rounded-lg text-white hover:bg-white/10 transition-colors"
                                        >
                                            {role === 'examiner' ? 'View Exam' : 'Take Exam'}
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-12 bg-[#111111] rounded-xl border border-white/5"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Award size={40} className="text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                {role === 'examiner' 
                                    ? "You haven't created any exams yet" 
                                    : "You've completed all available exams"}
                            </h3>
                            <p className="text-gray-400 mb-8">
                                {role === 'examiner'
                                    ? "Start by creating your first exam to get started"
                                    : "Check your results page to see how you did"}
                            </p>
                            
                            {role === 'examiner' ? (
                                <button 
                                    onClick={() => navigate('/create-exam')}
                                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium mx-auto"
                                >
                                    Create Your First Exam
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button 
                                    onClick={() => navigate('/results')}
                                    className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium mx-auto"
                                >
                                    View Your Results
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;