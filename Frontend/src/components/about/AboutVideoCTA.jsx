import React from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiShield, FiChevronRight } from 'react-icons/fi';
import videoBg from '../../assets/about_video_cta_bg.png';
import './AboutVideoCTA.css';

const AboutVideoCTA = () => {
    return (
        <section className="about-video-cta relative min-h-[500px] flex items-center overflow-hidden">
            {/* Background with Overlays */}
            <div 
                className="absolute inset-0 bg-cover bg-center -z-10"
                style={{ backgroundImage: `url(${videoBg})` }}
            />
            <div className="absolute inset-0 bg-[#0a1a2f]/85 z-0" /> {/* Solid Blue Shade */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a2f] via-transparent to-transparent z-0" />

            <div className="container mx-auto px-4 lg:px-20 relative z-10 py-20">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* Left: Play Button Area */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-start">
                        <motion.a
                            href="https://www.youtube.com/@SriPonniMedicalCentre"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            viewport={{ once: true }}
                            className="group relative flex items-center gap-6"
                        >
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                <FiPlay size={32} fill="currentColor" className="ml-1" />
                            </div>
                            <span className="text-white font-black uppercase tracking-[0.2em] text-sm md:text-base group-hover:text-primary transition-colors">
                                Watch Video
                            </span>
                            {/* Pulse Animation */}
                            <div className="absolute -inset-4 border-2 border-white/20 rounded-full animate-ping pointer-events-none" />
                        </motion.a>
                    </div>

                    {/* Right: Content Area */}
                    <div className="lg:w-1/2 text-white space-y-6 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3 justify-center lg:justify-start">
                                <span className="text-[#13a078] font-black text-xs uppercase tracking-[0.2em]">Our Watch Video</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Professional Medical Care <br className="hidden md:block" /> Measure Medical.
                            </h2>
                            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                                We are privileged to work with hundreds of future-thinking medial, including many of the world's top hardware, software, and brands, feel safe and comfortable in establishing.
                            </p>
                        </motion.div>

                    </div>
                </div>
            </div>

            {/* Decorative Icon */}
            <div className="absolute right-[5%] bottom-[10%] opacity-10 pointer-events-none hidden xl:block">
                <FiShield size={280} className="text-white" />
            </div>
        </section>
    );
};

export default AboutVideoCTA;
