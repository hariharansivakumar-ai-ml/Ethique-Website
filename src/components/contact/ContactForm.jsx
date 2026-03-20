import React from 'react';
import { motion } from 'framer-motion';
import formImage from '../../assets/contact_form_medical_or.png';
import './ContactForm.css';

const ContactForm = () => {
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
                        <div className="absolute inset-0 bg-[#0e3d64]/20" />
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
                                className="text-4xl font-bold text-[#0e3d64] mb-4"
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

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0e3d64] uppercase tracking-wider">Your Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#13a078] focus:ring-4 focus:ring-[#13a078]/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#0e3d64] uppercase tracking-wider">Email Address</label>
                                    <input 
                                        type="email" 
                                        placeholder="john@example.com"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#13a078] focus:ring-4 focus:ring-[#13a078]/5 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0e3d64] uppercase tracking-wider">Subject</label>
                                <input 
                                    type="text" 
                                    placeholder="Appointment Request"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#13a078] focus:ring-4 focus:ring-[#13a078]/5 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#0e3d64] uppercase tracking-wider">Message</label>
                                <textarea 
                                    rows="4"
                                    placeholder="How can we help you today?"
                                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:border-[#13a078] focus:ring-4 focus:ring-[#13a078]/5 transition-all resize-none"
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full py-5 bg-[#13a078] text-white font-bold rounded-2xl shadow-lg shadow-[#13a078]/20 hover:bg-[#0e8a65] hover:shadow-xl transition-all duration-300"
                            >
                                Send Message Now
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
