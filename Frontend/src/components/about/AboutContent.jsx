import React from 'react';
import { motion } from 'framer-motion';
import { FiHeadphones, FiUser, FiCheck, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import nursesImg from '../../assets/about_nurses_tablet.webp';
import patientImg from '../../assets/about_doctor.webp';
import stethoscopeImg from '../../assets/stethoscope_illustration.webp';
import './AboutContent.css';

const AboutContent = () => {
    return (
        <section className="about-content-section py-10 lg:py-24 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">
                    
                    {/* Left Side: Images & Graphics */}
                    <div className="lg:w-1/2 relative">
                        {/* Decorative elements */}
                        <div className="absolute -left-10 top-20 w-40 h-40 border-[15px] border-primary/10 rounded-full -z-10" />
                        <div className="absolute left-1/4 -bottom-10 w-24 h-24 bg-dots-pattern opacity-10 -z-10" />
                        
                        <div className="relative z-10">
                            {/* Main Top Image */}
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="about-image-main"
                            >
                                <img src={nursesImg} alt="Our Nurses" className="rounded-3xl shadow-2xl" />
                            </motion.div>
                            
                            {/* Experience Badge */}
                            <motion.div 
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="experience-badge-circular"
                            >
                                <div className="badge-inner">
                                    <span className="years">25</span>
                                    <span className="text">Years <br /> Experience</span>
                                </div>
                            </motion.div>
                            
                            {/* Bottom Secondary Image */}
                            <motion.div 
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="about-image-secondary"
                            >
                                <img src={patientImg} alt="Patient Care" className="rounded-3xl shadow-xl border-8 border-white" />
                            </motion.div>
                        </div>
                        
                        {/* Vertical Text */}
                        <div className="absolute -right-8 top-1/2 -translate-y-1/2 hidden xl:block">
                            <span className="vertical-text text-primary font-bold uppercase tracking-widest text-xs">How We Work</span>
                        </div>
                    </div>

                    {/* Right Side: Content Area */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.2
                                }
                            }
                        }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <motion.div 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="space-y-4"
                        >
                            <div className="section-tag flex items-center gap-3">
                                <span className="text-[#376e80] font-black text-xs uppercase tracking-widest">ABOUT ETHIQUE HOSPITALS</span>
                            </div>
                            <h2 className="about-main-title">
                                Transforming Healthcare <br /> With Compassion & Trust
                            </h2>
                            <div className="space-y-6 text-gray-500 text-lg leading-relaxed">
                                <motion.p 
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    Ethique Hospitals is committed to providing exceptional healthcare services through advanced medical expertise, patient-centered treatment, and compassionate support. Our multidisciplinary team of specialists works together to ensure every patient receives personalized care in a safe and modern healing environment.
                                </motion.p>
                                <motion.p 
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    With state-of-the-art facilities, advanced diagnostics, and a strong focus on clinical excellence, we continue to deliver quality healthcare solutions that improve lives and promote long-term wellness for individuals and families.
                                </motion.p>
                            </div>
                        </motion.div>

                        {/* Action Button */}
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
                            }}
                            className="pt-4"
                        >
                            <Link to="/contact" className="inline-block bg-primary text-white px-10 py-5 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 group">
                                Book Appointment
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Stethoscope Illustration Decorative */}
                    <div className="absolute right-0 -bottom-20 w-80 h-80 opacity-60 -z-1 pointer-events-none hidden xl:block">
                        <motion.img 
                            initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
                            whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                            transition={{ duration: 1.2 }}
                            viewport={{ once: true }}
                            src={stethoscopeImg} 
                            alt="" 
                            className="w-full h-full object-contain" 
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutContent;
