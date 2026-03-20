import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import logoImg from '../../assets/Sri-Ponni-Medical-Centre-scaled.png';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock authentication
        if (credentials.username === 'admin' && credentials.password === 'ponni123') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <img src={logoImg} alt="Sri Ponni" className="h-20 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-[#0e3d64]">Admin Portal</h1>
                    <p className="text-gray-500 mt-2">Sign in to manage your medical blog</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-blue-900/10 border border-gray-100 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                required
                                className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="Enter username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input 
                                type="password" 
                                required
                                className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="Enter password"
                                value={credentials.password}
                                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 group"
                    >
                        Sign In Now
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <p className="text-center text-xs text-gray-400 pt-4">
                        For demo use: admin / ponni123
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
