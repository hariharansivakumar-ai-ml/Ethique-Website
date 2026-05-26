import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiChevronLeft, FiSend, FiUser } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import chatbotData from '../../data/chatbotData.json';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const scrollRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && chatHistory.length === 0) {
            setChatHistory([
                { 
                    type: 'bot', 
                    content: "Hello! 👋 Welcome to **Sri Ponni Medical Centre**. How can we help you today? Please select a question below or pick a topic." 
                }
            ]);
        }
    }, [isOpen]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, selectedQuestion]);

    const handleQuestionClick = (q) => {
        const newHistory = [
            ...chatHistory,
            { type: 'user', content: q.question },
            { type: 'bot', content: q.answer }
        ];
        setChatHistory(newHistory);
        setSelectedQuestion(q);
    };

    const resetChat = () => {
        setSelectedQuestion(null);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="absolute bottom-20 right-0 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-primary p-6 text-white flex items-center justify-between shadow-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                    <FiMessageCircle className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight font-heading">Healthcare Assistant</h3>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs font-medium uppercase tracking-widest">Active Now</span>
                                    </div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Chat Content */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#fafafb] scroll-smooth"
                        >
                            {chatHistory.map((chat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: chat.type === 'bot' ? -20 : 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${chat.type === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        chat.type === 'bot' 
                                        ? 'bg-white text-gray-700 rounded-tl-none border border-gray-100' 
                                        : 'bg-primary text-white rounded-tr-none font-medium'
                                    }`}>
                                        <ReactMarkdown 
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-0" {...props} />
                                            }}
                                        >
                                            {chat.content}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Question List (if no active detailed answer view) */}
                            {!selectedQuestion && (
                                <div className="space-y-3 pt-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 mb-1">Frequently Asked</p>
                                    {chatbotData.questions.map((q) => (
                                        <motion.button
                                            key={q.id}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleQuestionClick(q)}
                                            className="w-full text-left p-4 bg-white border border-gray-100 rounded-xl text-xs font-bold text-[#103354] shadow-sm hover:border-primary hover:shadow-md transition-all flex items-center justify-between group"
                                        >
                                            {q.question}
                                            <FiChevronLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.button>
                                    ))}
                                </div>
                            )}

                            {selectedQuestion && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={resetChat}
                                    className="text-xs font-bold text-primary flex items-center gap-1 hover:underline pt-2 pl-1"
                                >
                                    <FiChevronLeft /> Ask another question
                                </motion.button>
                            )}
                        </div>

                        {/* Footer / Input Placeholder */}
                        <div className="p-4 bg-white border-t border-gray-50 flex items-center gap-3">
                            <div className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-xs text-gray-400 font-medium">
                                Type your message...
                            </div>
                            <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary disabled:opacity-50 cursor-not-allowed">
                                <FiSend />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Bubble Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
                    isOpen ? 'bg-white text-primary rotate-90 border border-gray-100' : 'bg-primary text-white'
                }`}
            >
                {isOpen ? <FiX size={28} /> : <FiMessageCircle size={30} />}
                
                {!isOpen && (
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [1, 0, 1] 
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-white/20 rounded-full"
                    />
                )}
            </motion.button>
        </div>
    );
};

export default ChatBot;
