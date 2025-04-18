import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, BarChart, Users, LogOut, ClipboardList } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="fixed inset-y-0 left-0 w-64 bg-[#111111] border-r border-white/5">
            <div className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <BookOpen size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-white">Examify</h1>
                </div>
                
                <nav className="flex-1 space-y-2">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <BookOpen size={20} />
                        <span>Dashboard</span>
                    </button>

                    {role === 'student' && (
                        <button 
                            onClick={() => navigate('/results')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <BarChart size={20} />
                            <span>Results</span>
                        </button>
                    )}

                    {role === 'examiner' && (
                        <button 
                            onClick={() => navigate('/create-exam')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <ClipboardList size={20} />
                            <span>Create Exam</span>
                        </button>
                    )}

                    <button 
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <Users size={20} />
                        <span>Profile</span>
                    </button>
                </nav>
                
                <div className="mt-auto space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{username}</p>
                            <p className="text-xs text-gray-400 capitalize">{role}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-colors shadow-lg hover:shadow-red-500/20"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar; 