import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import heroImg1 from "../assets/Hero image.webp";
import heroImg2 from "../assets/Heroimg2.webp";
import heroImg3 from "../assets/Heroimg3.webp";

const slides = [
  {
    image: heroImg1,
    badge: "WE SUPPORT BETTER HEALTHCARE",
    title: (
      <>
        Exceptional care <br />
        every patient
      </>
    ),
    subtitle: "Care you can believe in, Compassionate Care, Advanced Medicine",
    objectPosition: "center center",
  },
  {
    image: heroImg2,
    badge: "MODERN TECHNOLOGY",
    title: (
      <>
        Transform Your <br />
        Health Journey
      </>
    ),
    subtitle: "Advanced diagnostics and personalized treatment plans for your wellbeing.",
  },
  {
    image: heroImg3,
    badge: "DEDICATED TEAM",
    title: (
      <>
        Expert Doctors <br />
        At Your Service
      </>
    ),
    subtitle: "Our specialists are here to provide world-class medical expertise.",
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[50vh] md:min-h-[78vh] flex items-center px-4 sm:px-8 mb-6 overflow-hidden">
      {/* Background Container with Slide Animations */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-4 bottom-0 rounded-[4rem] overflow-hidden shadow-2xl bg-[#0a1a2f]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.15, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1.1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentSlide].image}
              alt="Hospital Presentation"
              className="w-full h-full object-cover grayscale-[10%] sepia-[5%] mix-blend-multiply"
              style={{ objectPosition: slides[currentSlide].objectPosition || "center 20%" }}
            />
            
            {/* Full Blue Shade Overlay */}
            <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay" />
            
            {/* Blue Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/50 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="container relative mx-auto z-10 px-6 py-12 sm:px-20 sm:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 1.6 }}
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
                  {slides[currentSlide].badge}
                </span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight drop-shadow-lg"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-lg text-white/90 font-medium max-w-3xl mt-4 opacity-90 leading-relaxed"
            >
              {slides[currentSlide].subtitle}
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
                Contact Us
                <FiArrowUpRight className="text-xl group-hover:rotate-45 transition-all" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Side Navigation Tab - Centered to the Hero Container */}
      <div className="absolute inset-x-4 sm:inset-x-8 top-12 bottom-0 pointer-events-none z-20">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block pointer-events-auto">
          <div className="bg-white/95 py-12 px-4 rounded-l-full shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col items-center gap-6 border-y border-l border-white/50 backdrop-blur-md">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-500 cursor-pointer ${
                  currentSlide === index
                    ? "bg-primary ring-[8px] ring-blue-50 scale-110"
                    : "bg-[#0a1a2f] hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
