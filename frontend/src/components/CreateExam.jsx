import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Save } from 'lucide-react';

const CreateExam = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], answer: '' }]);

    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', '', '', ''], answer: '' }]);
    };

    const handleChangeQuestion = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const handleChangeOption = (index, optionIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[index].options[optionIndex] = value;
        setQuestions(newQuestions);
    };

    const handleChangeAnswer = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].answer = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('https://examify-1.onrender.com/api/exams', { title, questions }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        window.location.href = '/dashboard';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-6">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-[#111111] p-8 rounded-xl border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Create Exam</h2>
                <input
                    type="text"
                    placeholder="Exam Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 mb-6 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    required
                />
                {questions.map((q, index) => (
                    <div key={index} className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
                        <input
                            type="text"
                            placeholder="Question"
                            onChange={(e) => handleChangeQuestion(index, e.target.value)}
                            className="w-full p-3 mb-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                        {q.options.map((option, optionIndex) => (
                            <input
                                key={optionIndex}
                                type="text"
                                placeholder={`Option ${optionIndex + 1}`}
                                onChange={(e) => handleChangeOption(index, optionIndex, e.target.value)}
                                className="w-full p-3 mb-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                                required
                            />
                        ))}
                        <input
                            type="text"
                            placeholder="Correct Answer"
                            onChange={(e) => handleChangeAnswer(index, e.target.value)}
                            className="w-full p-3 mt-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                            required
                        />
                    </div>
                ))}
                <div className="flex space-x-4">
                    <button 
                        type="button" 
                        onClick={addQuestion} 
                        className="flex items-center space-x-2 px-4 py-2 bg-white/5 text-white rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Add Question</span>
                    </button>
                    <button 
                        type="submit" 
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <Save size={20} />
                        <span>Create Exam</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateExam;