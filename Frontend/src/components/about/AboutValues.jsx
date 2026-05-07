import React from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiTarget } from 'react-icons/fi';
import valuesImg from '../../assets/about_values_medical.webp';
import './AboutValues.css';

const AboutValues = () => {
    return (
        <section className="about-values-section py-10 lg:py-24 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] -z-10" />

            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-24">

                    {/* Left Side: Large Image */}
                    <div className="w-full lg:w-[45%]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="values-image-container"
                        >
                            <img src={valuesImg} alt="Caring Healthcare" className="rounded-[40px] shadow-2xl" />
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 border-2 border-primary/10 rounded-[50px] -z-10" />
                        </motion.div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full lg:flex-1 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <span className="values-subtitle">OUR VALUE</span>
                            <h2 className="values-main-title mt-4">
                                Upholding Excellence, Empathy, and Integrity in Every Patient Journey
                            </h2>
                            <p className="text-gray-500 text-lg mt-6 leading-relaxed">
                                Our commitment extends beyond medicine. We strive to create a healing environment where every individual feels supported and understood.
                            </p>
                        </motion.div>

                        {/* Vision & Mission Blocks */}
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
                            className="space-y-6"
                        >
                            {/* Vision Card */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                                }}
                                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                                className="value-card group"
                            >
                                <div className="value-icon-box">
                                    <FiEye size={32} />
                                </div>
                                <div className="value-text-box">
                                    <h3>Our Vision</h3>
                                    <p>Our vision is to bring world-class medical care closer to home, where every patient is treated with kindness, dignity, and personalized attention.</p>
                                </div>
                            </motion.div>

                            {/* Mission Card */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: 50 },
                                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                                }}
                                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                                className="value-card group"
                            >
                                <div className="value-icon-box pink-theme">
                                    <FiTarget size={32} />
                                </div>
                                <div className="value-text-box">
                                    <h3>Our Mission</h3>
                                    <p>We are committed to fostering hope, strength, and well-being, while training the next generation of medical professionals in excellence.</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutValues;
