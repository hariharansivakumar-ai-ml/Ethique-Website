import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FaAmbulance, FaMicroscope, FaStethoscope, 
  FaHeartbeat, FaBone, FaChild, FaBrain,
  FaChevronLeft, FaChevronRight 
} from "react-icons/fa";

// Import images
import emergencyImg from "../../assets/service_emergency.webp";
import diagnosticsImg from "../../assets/service_diagnostics.webp";
import consultationImg from "../../assets/service_consultation.webp";
import cardiologyImg from "../../assets/service_cardiology.webp";
import orthopaedicsImg from "../../assets/service_orthopaedics.webp";
import pediatricsImg from "../../assets/service_pediatrics.webp";
import neurologyImg from "../../assets/service_neurology.webp";

import "./ServicesSection.css";

const services = [
  {
    title: "Emergency Care",
    desc: "24/7 medical support for accidents, injuries, and sudden health problems. With quick response, advanced equipment, and experienced doctors, emergencies are handled with speed, safety, and expert care to stabilize patients, prevent complications, and protect lives.",
    icon: <FaAmbulance />,
    image: emergencyImg
  },
  {
    title: "Diagnostics & Labs",
    desc: "Advanced imaging services including X-rays, CT scans, MRI, and ultrasound for accurate diagnosis and treatment planning. Expert radiologists use modern technology to detect conditions early, monitor progress, and guide effective medical care for patients.",
    icon: <FaMicroscope />,
    image: diagnosticsImg
  },
  {
    title: "General Medicine",
    desc: "Caring for everyday health needs, from minor illnesses to chronic conditions. With timely check-ups, accurate diagnosis, and effective treatment, patients receive the right support to recover quickly, maintain good health, and prevent future problems.",
    icon: <FaStethoscope />,
    image: consultationImg
  },
  {
    title: "Cardiology",
    desc: "Cardiology focuses on the diagnosis and treatment of heart problems, from routine check-ups to advanced care. Using modern tests and proven treatments, the team works to improve heart health, manage risks, and support patients through every stage of recovery.",
    icon: <FaHeartbeat />,
    image: cardiologyImg
  },
  {
    title: "Orthopaedics",
    desc: "Specialized in treating injuries and conditions affecting bones, joints, and muscles. Whether it’s a fracture, joint pain, or a sports injury, care is given using advanced diagnostics, modern therapies, and surgical expertise to help patients regain strength and move comfortably.",
    icon: <FaBone />,
    image: orthopaedicsImg
  },
  {
    title: "Pediatrics",
    desc: "Care for babies, children, and teens to keep them healthy and growing strong. Services include regular check-ups, vaccinations, illness treatment, and growth tracking. With gentle care, early diagnosis, and a focus on overall well-being, children are supported at every stage of development.",
    icon: <FaChild />,
    image: pediatricsImg
  },
  {
    title: "Neurology",
    desc: "Care for brain, spine, and nerve-related problems such as headaches, stroke, seizures, and movement disorders. With modern scans, expert guidance, and tailored treatment, the goal is to relieve symptoms, improve daily function, and support long-term health.",
    icon: <FaBrain />,
    image: neurologyImg
  }
];

const ServicesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setCardsToShow(1);
      else if (window.innerWidth < 1024) setCardsToShow(2);
      else setCardsToShow(3);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (services.length - cardsToShow + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (services.length - cardsToShow + 1)) % (services.length - cardsToShow + 1));
  };

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % (services.length - cardsToShow + 1);
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, [cardsToShow]);

  return (
    <section className="services-section overflow-hidden" id="services">
      <div className="container mx-auto px-4 sm:px-12">
        <header className="services-header flex justify-between items-end">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="services-subtitle"
            >
              <span className="dot"></span>
              Our Services
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="services-main-title text-left"
            >
              <span className="text-[#0e548a]">We Offer For You Medical &</span> <br />
              <span className="text-[#0e548a]">Saving Lives</span>
            </motion.h2>
          </div>

          <div className="slider-controls flex gap-4 pb-4">
            <button onClick={prevSlide} className="slider-nav-btn">
              <FaChevronLeft />
            </button>
            <button onClick={nextSlide} className="slider-nav-btn">
              <FaChevronRight />
            </button>
          </div>
        </header>

        <div className="services-slider-container overflow-hidden" ref={containerRef}>
          <motion.div 
            className="services-flex"
            animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
          >
            {services.map((service, index) => (
              <div 
                key={index}
                className="service-card-wrapper"
                style={{ flex: `0 0 ${100 / cardsToShow}%` }}
              >
                <motion.div 
                  className="service-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.6, 
                    delay: (index % cardsToShow) * 0.15,
                    ease: "easeOut" 
                  }}
                  whileHover={{ 
                    y: -12, 
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  <div className="service-img-container overflow-hidden">
                    <motion.img 
                      src={service.image} 
                      alt={service.title}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <motion.div 
                    className="service-icon-badge"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {service.icon}
                  </motion.div>
                  <div className="service-content">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="services-footer-btn flex justify-center mt-12"
        >
          <Link to="/services" className="btn-appointment bg-[#0e548a] hover:bg-[#0d4a7a] text-sm px-10 py-4 shadow-xl">
            OUR SERVICES
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
