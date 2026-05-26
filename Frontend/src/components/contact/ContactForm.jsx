import React, { useState } from 'react';
import { motion } from 'framer-motion';
import formImage from '../../assets/contact_form_medical_or.webp';
import './ContactForm.css';
import { config } from '../../config';

const API_URL = config.API_URL;

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${API_URL}/api/contact/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus('error');
        }
    };

    return (
        <section className="contact-form-section py-24 bg-[#f8fafc]">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row bg-white rounded-[40px] overflow-hidden shadow-2xl shadow-gray-200/50">
                    {/* Image Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="lg:w-1/2 relative min-h-[400px]"
                    >
                        <img 
                            src={formImage} 
                            alt="Medical Team" 
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#103354]/20" />
                    </motion.div>

                    {/* Form Side */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="lg:w-1/2 p-10 md:p-16 lg:p-20"
                    >
                        <div className="mb-10">
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-4xl font-bold text-[#103354] mb-4"
                            >
                                Send Us A Message
                            </motion.h2>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="text-gray-500 text-lg leading-relaxed"
                            >
                                Have questions or need assistance? Fill out the form below, and 
                                our friendly medical team will get back to you as soon as possible.
                            </motion.p>
                        </div>

                        {status === 'success' ? (
                            <div className="p-6 bg-green-50 text-green-700 rounded-2xl border border-green-200 text-center">
                                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                                <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button 
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 px-6 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
                                        An error occurred while sending your message. Please try again.
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#103354] uppercase tracking-wider">Your Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#376e80] focus:ring-4 focus:ring-[#376e80]/5 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#103354] uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#376e80] focus:ring-4 focus:ring-[#376e80]/5 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#103354] uppercase tracking-wider">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Appointment Request"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#376e80] focus:ring-4 focus:ring-[#376e80]/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#103354] uppercase tracking-wider">Message</label>
                                    <textarea 
                                        rows="4"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help you today?"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#376e80] focus:ring-4 focus:ring-[#376e80]/5 transition-all resize-none"
                                    ></textarea>
                                </div>
                                
                                <button 
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`w-full py-5 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#376e80] hover:bg-[#2d5a6c] shadow-[#376e80]/20 hover:shadow-xl'}`}
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message Now'}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
