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
              Start Your Recovery With Us
            </motion.div>
            
            <motion.h2 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-8 text-[#0e548a]"
            >
              {/* Desktop View */}
              <span className="hidden md:block">
                Expert Medical Care Team <br />
                & Advanced Technology
              </span>
              {/* Mobile View */}
              <span className="block md:hidden">
                Expert Medical Care <br />
                Team & Advanced <br />
                Technology
              </span>
            </motion.h2>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-lg leading-relaxed max-w-2xl mb-6"
            >
              Our caring doctors are here to support you every step of the way. We provide personalized care in a warm and friendly environment. Your health and comfort are our top priorities.
            </motion.p>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-lg leading-relaxed max-w-2xl mb-6"
            >
              Expert care that helps you heal. Treatments focused on your health and comfort. A warm, welcoming place for every visit. Support you can trust throughout your journey. Our emergency and ICU teams provide expert treatment with kindness, and our operation theatre has advanced equipment for safe and precise surgeries.
            </motion.p>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-slate-500 text-md leading-relaxed max-w-2xl mb-8 italic italic"
            >
              Learn more <Link to="/about" className="text-primary hover:underline">about our hospital</Link> and explore our 
              <Link to="/services" className="text-primary hover:underline ml-1">medical services</Link> in Velur. 
              For appointments, <Link to="/contact" className="text-primary hover:underline ml-1">contact us today</Link>.
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
                <span className="experience-years">20</span>
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

