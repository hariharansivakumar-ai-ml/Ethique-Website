import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import popupImage from '../../assets/popup_medical_icon.webp';
import { config } from '../../config';

const API_URL = config.API_URL;

const PopupWidget = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showForm, setShowForm] = useState(false); // Controls the large modal
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const hasClosed = localStorage.getItem('sriponni_popup_closed');
        if (hasClosed) return;

        // 1. Time-based trigger: Show after 10 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10000);

        // 2. Scroll-based trigger: Show after 30% scroll depth
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            // If the page is too short to scroll, the 10s timer will handle it
            if (scrollHeight > 0 && scrolled / scrollHeight > 0.3) {
                setIsVisible(true);
                window.removeEventListener('scroll', handleScroll);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleCloseWidget = () => {
        setIsVisible(false);
        localStorage.setItem('sriponni_popup_closed', 'true');
    };

    const handleCloseModal = () => {
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const res = await fetch(`${API_URL}/api/subscriptions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (res.ok) {
                setIsSubmitting(false);
                setIsSuccess(true);
                // After success, close after 2.5 seconds
                setTimeout(() => {
                    setShowForm(false);
                    setIsVisible(false);
                    localStorage.setItem('sriponni_popup_closed', 'true');
                }, 2500);
            } else {
                alert("Something went wrong. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Subscription error:", error);
            alert("Error connecting to server. Please try again later.");
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <>
                    {/* 1. Small Corner Widget (Shown first) */}
                    {!showForm && (
                        <motion.div
                            initial={{ opacity: 0, x: -50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -50, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="fixed bottom-6 left-6 z-[100] w-[320px] md:w-[350px]"
                        >
                            <div className="relative bg-white rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex p-4 items-center gap-4 border border-gray-50">
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseWidget}
                                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all z-10"
                                >
                                    <FiX size={16} />
                                </button>

                                {/* Icon Block */}
                                <div className="relative w-20 h-20 flex-shrink-0 -ml-6 shadow-[0_10px_20px_rgba(16,185,129,0.3)] rounded-2xl overflow-hidden bg-primary p-0.5 transform -rotate-3">
                                    <div className="w-full h-full rounded-2xl overflow-hidden relative bg-white">
                                        <img src={popupImage} alt="Health" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
                                    </div>
                                </div>

                                <div className="flex-1 pr-4">
                                    <h4 className="text-primary font-extrabold text-[15px] leading-tight mb-1">Join Our Network</h4>
                                    <p className="text-[11px] text-gray-500 mb-2 font-medium">Unlock free health tips and camp alerts.</p>
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#0da06d] text-white text-[11px] font-bold py-2 px-3 rounded-xl transition-all"
                                    >
                                        Subscribe Now <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* 2. Large Centered Modal (Triggered by button) */}
                    {showForm && (
                        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleCloseModal}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />

                            {/* Modal Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-[850px] bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.3)] flex flex-col md:flex-row min-h-[450px] md:min-h-[550px]"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-5 right-5 z-20 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                                >
                                    <FiX size={24} />
                                </button>

                                {/* Left Side: Gradient + Graphic */}
                                <div className="md:w-[45%] bg-gradient-to-br from-[#1e3a8a] via-[#312e81] to-[#4c1d95] p-10 md:p-14 flex flex-col justify-center items-center text-center relative overflow-hidden text-white">
                                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                                    
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="relative z-10">
                                        <div className="w-32 h-32 md:w-36 md:h-36 mb-8 mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
                                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                                                <img src={popupImage} alt="Subscribe" className="w-full h-full object-cover scale-110" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">Supercharge Your Health</h2>
                                        <p className="text-white/70 text-base font-medium leading-relaxed">Join 2,000+ local families. Get exclusive medical tips & health secrets.</p>
                                    </motion.div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="md:w-[55%] p-10 md:p-16 flex flex-col justify-center">
                                    {isSuccess ? (
                                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <FiCheckCircle size={40} />
                                            </div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Subscription Active!</h3>
                                            <p className="text-gray-500">Thank you for joining the Sri Ponni community.</p>
                                        </motion.div>
                                    ) : (
                                        <>
                                            <div className="mb-10">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Your Spot.</h3>
                                                <p className="text-gray-500 text-sm font-medium">Activate your free subscription instantly below.</p>
                                            </div>

                                            <form onSubmit={handleSubmit} className="space-y-5">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-gray-700" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                                    <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-gray-700" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number <span className="opacity-50">(optional)</span></label>
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary/50 transition-all font-medium text-gray-700" />
                                                </div>
                                                <button type="submit" disabled={isSubmitting} className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-[#0da06d] text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 active:scale-95">
                                                    {isSubmitting ? 'Activating...' : 'Activate Subscription'}
                                                    <FiArrowRight className="transform group-hover:translate-x-2 transition-all" />
                                                </button>
                                            </form>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </AnimatePresence>
    );
};

export default PopupWidget;
