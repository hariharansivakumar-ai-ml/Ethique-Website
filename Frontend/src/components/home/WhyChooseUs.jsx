import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiUsers, FiClock, FiShield } from 'react-icons/fi';
import chooseImg from '../../assets/why_choose_us.webp'; // Updated with unique asset

const features = [
    {
        icon: <FiUsers />,
        title: "Experienced Specialists",
        desc: "Our skilled doctors and healthcare professionals provide expert treatment across multiple medical specialties."
    },
    {
        icon: <FiClock />,
        title: "24/7 Emergency Support",
        desc: "Round-the-clock emergency care ensures immediate medical attention whenever you need it most."
    },
    {
        icon: <FiShield />,
        title: "Patient-Centered Care",
        desc: "We focus on personalized treatment plans designed around each patient’s comfort, safety, and recovery."
    },
    {
        icon: <FiCheck />,
        title: "Advanced Medical Facilities",
        desc: "Equipped with modern medical technology for accurate diagnosis, treatment, and surgical precision."
    }
];

const WhyChooseUs = () => {
    return (
        <section className="why-choose-us py-12 lg:py-24 bg-white overflow-hidden" id="why-choose-us">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
                    
                    {/* Left: Content */}
                    <div className="lg:w-1/2 space-y-6 lg:space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <span className="text-[#376e80] font-black text-xs uppercase tracking-widest block">OUR HEALTHCARE PROMISE</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#103354] leading-tight">
                                Why Choose <br /> Ethique Hospitals
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                We combine medical excellence, compassionate care, and modern technology to provide patients with trusted healthcare services and a comfortable healing experience.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 pt-2 md:pt-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4 group"
                                >
                                    <div className="w-12 h-12 shrink-0 bg-[#eef5f7] text-[#376e80] rounded-xl flex items-center justify-center text-xl group-hover:bg-[#376e80] group-hover:text-white transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#103354] mb-2">{feature.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
                            <img src={chooseImg} alt="Why Choose Ethique Hospitals" className="w-full h-auto" />
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#376e80]/10 rounded-full -z-10 blur-3xl" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
