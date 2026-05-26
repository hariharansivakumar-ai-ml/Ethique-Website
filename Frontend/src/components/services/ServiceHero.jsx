import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/indian_services_hero_consultation.webp';
import './ServiceHero.css';

const ServiceHero = ({ title, subtitle, description, bottomText }) => {
  return (
    <section className="relative min-h-[50vh] md:min-h-[78vh] flex items-center px-4 sm:px-8 mb-6 overflow-hidden">

      {/* Background Container — rounded card exactly like Home hero */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-0 rounded-[4rem] overflow-hidden shadow-2xl bg-[#0a1a2f]">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={heroBg}
            alt={title}
            className="w-full h-full object-cover grayscale-[10%] sepia-[5%] mix-blend-multiply"
            style={{ objectPosition: 'center center' }}
          />

          {/* Blue Shade Overlay */}
          <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />

          {/* Blue Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/50 to-transparent" />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container relative mx-auto z-10 px-6 py-12 sm:px-20 sm:py-16">
        <div className="max-w-4xl space-y-6 md:space-y-8">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.2] tracking-tight drop-shadow-lg"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
              className="text-sm md:text-lg text-white/90 font-medium max-w-2xl leading-relaxed border-l-4 border-red-700 pl-5"
            >
              {subtitle}
            </motion.p>
          )}

          {/* Description */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
              className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed"
            >
              {description}
            </motion.p>
          )}

          {/* Bottom Text / CTA */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
            className="text-white/70 text-sm md:text-md italic max-w-2xl"
          >
            {bottomText || (
              <>
                We offer a wide range of treatments. To know more about our hospital, visit 
                <Link to="/about" className="text-white hover:underline font-bold ml-1">About Us</Link> or 
                <Link to="/contact" className="text-white hover:underline font-bold ml-1">Contact Us</Link> for consultation.
              </>
            )}
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
