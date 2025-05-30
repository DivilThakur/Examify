/* eslint-disable no-unused-vars */
// src/components/Results.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, Award, CheckCircle, XCircle, FileText } from 'lucide-react';
import Sidebar from './Sidebar';

const Results = () => {
    const [results, setResults] = useState([]);
    const [exams, setExams] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                
                // Fetch results
                const resultsResponse = await axios.get('https://examify-1.onrender.com/api/results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Filter out results with null exam data
                const validResults = resultsResponse.data.filter(result => result && result.exam);
                
                if (validResults.length !== resultsResponse.data.length) {
                    console.warn('Some results had missing exam data and were filtered out');
                }
                
                setResults(validResults);
                setLoading(false);
            } catch (err) {
                setError('Failed to load your results. Please try again later.');
                setLoading(false);
                console.error('Error fetching results:', err);
            }
        };
        
        fetchData();
    }, []);

    const calculatePercentage = (result) => {
        // Add null check for result.exam
        if (!result || !result.exam || !result.exam.questions) {
            return 0;
        }
        
        const totalQuestions = result.exam.questions.length;
        if (totalQuestions === 0) return 0;
        
        return Math.round((result.score / totalQuestions) * 100);
    };

    const getExamTitle = (result) => {
        // Add null check for result.exam
        if (!result || !result.exam) {
            return "Unknown Exam";
        }
        return result.exam.title || "Untitled Exam";
    };

    const getQuestionCount = (result) => {
        // Add null check for result.exam
        if (!result || !result.exam || !result.exam.questions) {
            return 0;
        }
        return result.exam.questions.length;
    };

    const downloadCertificate = (resultId) => {
        setLoading(true);
        const token = localStorage.getItem('token');
        axios({
            url: `https://examify-1.onrender.com/api/results/certificate/${resultId}`,
            method: 'GET',
            responseType: 'blob',
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificate-${resultId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            setError('Error downloading certificate. Please try again later.');
            console.error('Error downloading certificate:', error);
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading && results.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <Sidebar />
                <div className="ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading your results...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white">
                <Sidebar />
                <div className="ml-64 p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                            <div className="text-center">
                                <div className="text-red-500 mb-4">
                                    <XCircle size={48} className="mx-auto" />
                                </div>
                                <p className="text-gray-400">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Sidebar />
            
            {/* Main Content */}
            <div className="ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Your Results</h1>
                    <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden mb-8">
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-4">
                            <div className="flex items-center ">
                                <Award className="text-white mr-3" size={24} />
                                <h1 className="text-2xl font-bold text-white">Your Exam Results</h1>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-400 mb-6">
                                View your performance across all exams. Download certificates for the exams you've passed.
                            </p>
                            
                            {results.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto text-gray-400 mb-3" size={48} />
                                    <p className="text-gray-400">You haven't taken any exams yet.</p>
                                    <button 
                                        onClick={() => window.location.href = '/exams'} 
                                        className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors"
                                    >
                                        Browse Available Exams
                                    </button>
                                </div>
                            ) : (
                                <motion.div 
                                    className="space-y-4"
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                >
                                    {results.map(result => {
                                        const percentage = calculatePercentage(result);
                                        const totalQuestions = getQuestionCount(result);
                                        
                                        return (
                                            <motion.div 
                                                key={result._id} 
                                                className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden hover:border-white/10 transition-colors"
                                                variants={item}
                                            >
                                                <div className={`flex justify-between items-center p-5 ${result.passed ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                                                    <div className="flex items-center">
                                                        {result.passed ? 
                                                            <CheckCircle className="text-green-400 mr-3" size={20} /> : 
                                                            <XCircle className="text-red-400 mr-3" size={20} />
                                                        }
                                                        <div>
                                                            <h3 className="font-semibold text-white">{getExamTitle(result)}</h3>
                                                            <p className="text-sm text-gray-400">
                                                                {result.passed ? 'Passed' : 'Failed'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                            {percentage}%
                                                        </div>
                                                        <p className="text-sm text-gray-400">{totalQuestions} questions</p>
                                                    </div>
                                                </div>
                                                <div className="p-5 border-t border-white/5">
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-sm text-gray-400">
                                                            Score: {result.score}/{totalQuestions}
                                                        </div>
                                                        {result.passed && (
                                                            <button
                                                                onClick={() => downloadCertificate(result._id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                                            >
                                                                <Download size={16} />
                                                                Download Certificate
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Results;