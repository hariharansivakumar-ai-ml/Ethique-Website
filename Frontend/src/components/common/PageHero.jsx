import React from 'react';
import { motion } from 'framer-motion';
import './PageHero.css';

const PageHero = ({ title, subtitle, bgImage }) => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[88vh] flex items-center px-4 sm:px-8 mb-6 overflow-hidden">
      
      {/* Background Container — same rounded card as Home hero */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-0 rounded-[4rem] overflow-hidden shadow-2xl bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={bgImage}
            alt={title}
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center center' }}
          />

          {/* Dark Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container relative mx-auto z-10 px-6 py-12 sm:px-20 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 }}
          className="max-w-4xl space-y-6 md:space-y-8"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg"
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
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
