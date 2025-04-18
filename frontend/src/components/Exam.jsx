import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const Exam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const role = localStorage.getItem('role');
    const [tabSwitches, setTabSwitches] = useState(0);
    const examStartTime = useRef(Date.now());
    const toastIds = useRef({
        copyPaste: null,
        rightClick: null,
        tabSwitch: null,
        keyboardShortcut: null
    });
    const isAutoSubmitting = useRef(false);
    const countdownInterval = useRef(null);
    const modalDiv = useRef(null);
    
    // Function to show a toast with ID to prevent duplicates
    const showToast = (type, message, options = {}) => {
        // Skip if already auto-submitting
        if (isAutoSubmitting.current) return;
        
        // If a toast with this ID already exists, dismiss it first
        if (toastIds.current[type]) {
            toast.dismiss(toastIds.current[type]);
        }
        
        // Show the new toast and store its ID
        toastIds.current[type] = toast.error(message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            ...options
        });
    };
    
    // Function to handle tab visibility change
    const handleVisibilityChange = () => {
        // Skip if already auto-submitting
        if (isAutoSubmitting.current) return;
        
        if (document.hidden) {
            // User is leaving the tab
            setTabSwitches(prev => {
                const newCount = prev + 1;
                
                // Show toast notification with unique ID
                showToast('tabSwitch', `Warning: You've switched tabs ${newCount}/3 times. After 3 switches, your exam will be submitted automatically.`, {
                    autoClose: 3000
                });
                
                // If reached limit, auto-submit
                if (newCount >= 3) {
                    // Set auto-submitting flag to prevent more toasts
                    isAutoSubmitting.current = true;
                    
                    // Show a modal-like message before auto-submitting
                    modalDiv.current = document.createElement('div');
                    modalDiv.current.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                    modalDiv.current.innerHTML = `
                        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md text-center">
                            <h3 class="text-xl font-bold text-red-600 mb-4">Exam Auto-Submitted</h3>
                            <p class="mb-4">Your exam has been automatically submitted due to switching tabs 3 times.</p>
                            <p class="text-sm text-gray-500">You will be redirected to the results page in <span id="countdown">10</span> seconds.</p>
                        </div>
                    `;
                    document.body.appendChild(modalDiv.current);
                    
                    // Start countdown
                    let countdown = 10;
                    const countdownElement = document.getElementById('countdown');
                    
                    // Clear any existing interval
                    if (countdownInterval.current) {
                        clearInterval(countdownInterval.current);
                    }
                    
                    countdownInterval.current = setInterval(() => {
                        countdown--;
                        if (countdownElement) {
                            countdownElement.textContent = countdown;
                        }
                        
                        if (countdown <= 0) {
                            clearInterval(countdownInterval.current);
                            // Force a re-render to ensure navigation happens
                            setTimeout(() => {
                                handleAutoSubmit();
                            }, 100);
                        }
                    }, 1000);
                }
                
                return newCount;
            });
        }
    };
    
    // Function to handle auto-submission
    const handleAutoSubmit = async () => {
        try {
           
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
            
            // Remove the modal if it exists
            if (modalDiv.current && modalDiv.current.parentNode) {
                modalDiv.current.parentNode.removeChild(modalDiv.current);
            }
            
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/exams/submit', 
                { 
                    examId: id, 
                    answers,
                    autoSubmitted: true,
                    tabSwitches: 3, 
                    duration: Math.floor((Date.now() - examStartTime.current) / 1000) 
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.info("Your exam has been submitted automatically due to multiple tab switches.", {
                position: "top-center",
                autoClose: 3000,
            });
            
            // Force navigation to results page
            window.location.href = '/results';
        } catch (error) {
            console.error('Error auto-submitting exam:', error);
            toast.error("Failed to submit exam automatically. Please try again.");
        }
    };
    
    // Function to handle copy-paste prevention
    const preventCopyPaste = (e) => {
        e.preventDefault();
        showToast('copyPaste', "Copy-paste is not allowed during the exam!");
        return false;
    };
    
    // Function to handle right-click prevention
    const preventRightClick = (e) => {
        e.preventDefault();
        showToast('rightClick', "Right-click is not allowed during the exam!");
        return false;
    };
    
    // Function to handle keyboard shortcuts
    const preventKeyboardShortcuts = (e) => {
       
        if (isAutoSubmitting.current) return;
        
       
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a')) {
            e.preventDefault();
            showToast('keyboardShortcut', "Keyboard shortcuts are not allowed during the exam!");
        }
    };
    
    useEffect(() => {
        // Add event listeners for anti-cheating measures only if user is a student
        if (role === 'student') {
            document.addEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('copy', preventCopyPaste);
            document.addEventListener('paste', preventCopyPaste);
            document.addEventListener('cut', preventCopyPaste);
            document.addEventListener('contextmenu', preventRightClick);
            document.addEventListener('keydown', preventKeyboardShortcuts);
        }

        return () => {
            if (role === 'student') {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                document.removeEventListener('copy', preventCopyPaste);
                document.removeEventListener('paste', preventCopyPaste);
                document.removeEventListener('cut', preventCopyPaste);
                document.removeEventListener('contextmenu', preventRightClick);
                document.removeEventListener('keydown', preventKeyboardShortcuts);
            }

            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
            
            if (modalDiv.current && modalDiv.current.parentNode) {
                modalDiv.current.parentNode.removeChild(modalDiv.current);
            }
            
            Object.values(toastIds.current).forEach(id => {
                if (id) toast.dismiss(id);
            });
        };
    }, [role]);
    
    useEffect(() => {
        const fetchExam = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/api/exams/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                
                setExam(response.data);
                setAnswers(Array(response.data.questions.length).fill(''));
                setError(null);
            } catch (error) {
                console.error('Error fetching exam:', error);
                
                
                if (error.response && error.response.status === 403) {
                    setError(error.response.data.message);
                    setTimeout(() => {
                        navigate('/results');
                    }, 3000);
                } else {
                    setError('Failed to load exam. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        };
        
        fetchExam();
    }, [id, navigate]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/exams/submit', 
                { 
                    examId: id, 
                    answers,
                    duration: Math.floor((Date.now() - examStartTime.current) / 1000) // Duration in seconds
                }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            toast.success('Exam submitted successfully!', {
                position: "top-center",
                autoClose: 2000,
            });
            
            navigate('/results');
        } catch (error) {
            console.error('Error submitting exam:', error);
            
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || 'Failed to submit exam', {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                toast.error('Network error. Please try again.', {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-20 h-20 border-4 border-white/10 border-t-blue-500 rounded-full"
                />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#111111] rounded-2xl border border-white/5 p-8 max-w-md w-full"
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <p className="text-sm text-gray-500">Redirecting to results page...</p>
                    </div>
                </motion.div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            <ToastContainer limit={1} />
            
            <div className="fixed top-0 left-0 right-0 bg-[#111111]/80 backdrop-blur-sm border-b border-white/5 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="bg-white/5 p-2 rounded-lg mr-3">
                                <Clock size={20} className="text-blue-500" />
                            </div>
                            <span className="text-gray-400">
                                Time Remaining: {Math.floor((exam.duration * 60 - (Date.now() - examStartTime.current) / 1000) / 60)} minutes
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="bg-white/5 p-2 rounded-lg mr-3">
                                <AlertTriangle size={20} className="text-yellow-500" />
                            </div>
                            <span className="text-yellow-400">
                                {3 - tabSwitches} switches remaining
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-white mb-2">{exam.title}</h1>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {exam.questions.map((question, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#111111] rounded-2xl border border-white/5 p-6 mb-6"
                            >
                                <div className="flex items-start">
                                    <div className="bg-white/5 text-blue-500 font-bold rounded-lg px-3 py-1 mr-4">
                                        Q{index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-lg font-medium text-white mb-4">{question.question}</p>
                                        <div className="space-y-3">
                                            {question.options.map((option, optionIndex) => (
                                                <label 
                                                    key={optionIndex} 
                                                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all ${
                                                        answers[index] === option 
                                                            ? 'bg-white/5 border-blue-500' 
                                                            : 'bg-white/5 hover:bg-white/10 border-white/10'
                                                    } border`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`question-${index}`}
                                                        value={option}
                                                        checked={answers[index] === option}
                                                        onChange={() => {
                                                            const newAnswers = [...answers];
                                                            newAnswers[index] = option;
                                                            setAnswers(newAnswers);
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                                                        answers[index] === option 
                                                            ? 'border-blue-500 bg-blue-500' 
                                                            : 'border-white/20'
                                                    }`}>
                                                        {answers[index] === option && (
                                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                                        )}
                                                    </div>
                                                    <span className="text-gray-300">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-6 mt-8"
                    >
                        {role === 'student' ? (
                            <motion.button 
                                type="submit"
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-medium flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
                            >
                                <CheckCircle size={20} className="mr-2" />
                                Submit Exam
                            </motion.button>
                        ) : (
                            <button 
                                className="w-full bg-white/5 text-gray-400 py-4 rounded-xl font-medium cursor-not-allowed border border-white/10"
                                disabled
                            >
                                Author can't Attempt
                            </button>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Exam;