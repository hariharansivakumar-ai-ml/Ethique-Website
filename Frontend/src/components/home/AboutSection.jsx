import { motion } from "framer-motion";
import aboutMainImg from "../../assets/about_doc_team.webp";
import aboutTechImg from "../../assets/about_tech_preview.webp";
import { FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section className="py-10 bg-white overflow-hidden" id="about">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Content */}
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
            className="w-full lg:w-[55%]"
          >
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 }
              }}
              className="about-subtitle"
            >
              <span className="dot"></span>
              Advanced Healthcare Solutions & Modern Medical Technology
            </motion.div>
            
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-[#103354]"
            >
              {/* Desktop View */}
              <span className="hidden md:block">
                Begin Your Healing <br />
                Journey With Trusted <br />
                Medical Experts
              </span>
              {/* Mobile View */}
              <span className="block md:hidden">
                Begin Your Healing <br />
                Journey With Trusted <br />
                Medical Experts
              </span>
            </motion.h2>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-lg leading-relaxed max-w-2xl mb-6"
            >
              At Ethique Hospitals, we are dedicated to delivering exceptional healthcare services in a safe, caring, and patient-focused environment. Our expert doctors, skilled nursing staff, and advanced medical facilities ensure every patient receives personalized attention and high-quality treatment.
            </motion.p>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-lg leading-relaxed max-w-2xl mb-6"
            >
              From emergency care and diagnostics to specialized treatments and surgical procedures, we provide complete healthcare solutions designed to support your recovery, comfort, and long-term wellness.
            </motion.p>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-md leading-relaxed max-w-2xl mb-8 italic italic"
            >
              Learn more <Link to="/about" className="text-primary hover:underline">about Ethique Hospitals</Link> and discover our 
              <Link to="/services" className="text-primary hover:underline ml-1">comprehensive healthcare services</Link>. 
              <Link to="/contact" className="text-primary hover:underline ml-1">Contact us today</Link> to schedule your appointment.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1 }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link to="/about" className="btn-blue px-11 py-5 text-sm uppercase font-bold tracking-widest flex items-center gap-3">
                ABOUT US
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Complex Image Layout */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-[45%]"
          >

            <div className="about-image-wrapper">
              {/* Experience Badge */}
              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", damping: 15 }}
                className="experience-badge"
              >
                <span className="experience-years">25</span>
                <span className="experience-text">Years <br /> Experience</span>
              </motion.div>

              {/* Main Image */}
              <img 
                src={aboutMainImg} 
                alt="Medical Team" 
                className="about-main-img"
              />

              {/* Secondary Image / Video Preview */}
              <a 
                href="https://www.youtube.com/@SriPonniMedicalCentre" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="about-secondary-img block cursor-pointer"
              >
                <img 
                  src={aboutTechImg} 
                  alt="Tech Preview" 
                  className="w-full h-full object-cover"
                />
                <div className="play-button-overlay">
                  <FaPlay />
                </div>
              </a>

              {/* Decorative Pattern */}
              <div className="about-dots-pattern"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;

