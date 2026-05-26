import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import heroVideo from "../assets/Healthcare_hero_background_video_202605261526.mp4";

const Hero = () => {
  return (
    <section className="relative min-h-[60vh] md:min-h-[88vh] flex items-center px-4 sm:px-8 mb-6 overflow-hidden">
      {/* Background Container with Video */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-0 rounded-[4rem] overflow-hidden shadow-2xl bg-black">
        <video
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center center' }}
        />
        
        {/* Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="container relative mx-auto z-10 px-6 py-12 sm:px-20 sm:py-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl space-y-6 md:space-y-10"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <div className="px-6 py-2 border-2 border-white/30 rounded-full flex items-center gap-3 bg-white/5 backdrop-blur-md">
              <span className="text-white text-xs font-black tracking-widest uppercase">
                DEDICATED CARE TEAM
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-5xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-lg"
          >
            Expert Doctors <br />
            Committed To Your Health
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm md:text-lg text-white/90 font-medium max-w-3xl mt-4 opacity-90 leading-relaxed"
          >
            Our experienced medical specialists provide advanced treatment with compassion, precision, and personalized patient care.
          </motion.p>

          {/* Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-4 flex flex-wrap gap-6"
          >
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl shadow-blue-600/30 text-base uppercase tracking-wider group"
            >
              Book Appointment
              <FiArrowUpRight className="text-xl group-hover:rotate-45 transition-all" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
