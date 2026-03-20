import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiUsers, FiClock, FiShield } from 'react-icons/fi';
import chooseImg from '../../assets/why_choose_us.png'; // Updated with unique asset

const features = [
    {
        icon: <FiUsers />,
        title: "Expert Medical Team",
        desc: "Our doctors are highly qualified specialists with years of experience in their respective fields."
    },
    {
        icon: <FiClock />,
        title: "24/7 Emergency Care",
        desc: "We provide round-the-clock medical support to handle any emergency with speed and care."
    },
    {
        icon: <FiShield />,
        title: "Patient-Focused Care",
        desc: "Your comfort and well-being are our top priorities. We treat every patient like family."
    },
    {
        icon: <FiCheck />,
        title: "Modern Facilities",
        desc: "Equipped with the latest medical technology to provide accurate diagnosis and treatment."
    }
];

const WhyChooseUs = () => {
    return (
        <section className="why-choose-us py-24 bg-white overflow-hidden" id="why-choose-us">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    
                    {/* Left: Content */}
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4"
                        >
                            <span className="text-[#13a078] font-black text-xs uppercase tracking-widest block">Why Choose Us</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#0e548a] leading-tight">
                                Your Most Trusted <br /> Healthcare Partner
                            </h2>
                            <p className="text-gray-500 text-lg leading-relaxed">
                                We combine medical excellence with compassionate care to provide 
                                the best healthcare experience for our patients and their families.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="flex gap-4 group"
                                >
                                    <div className="w-12 h-12 shrink-0 bg-[#ebf7f4] text-[#13a078] rounded-xl flex items-center justify-center text-xl group-hover:bg-[#13a078] group-hover:text-white transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[#0e548a] mb-2">{feature.title}</h3>
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
                            <img src={chooseImg} alt="Why Choose Sri Ponni" className="w-full h-auto" />
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10 blur-3xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#13a078]/10 rounded-full -z-10 blur-3xl" />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
