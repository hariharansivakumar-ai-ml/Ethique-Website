import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import doctorImg from "../../assets/indian_testimonial_doctor.webp";
import p1 from "../../assets/patient_1.webp";
import p2 from "../../assets/patient_2.webp";
import p3 from "../../assets/patient_3.webp";
import "./TestimonialSection.css";

const testimonials = [
  {
    name: "Karthikeyan S",
    label: "Happy Patient",
    image: p1,
    text: "The medical team at Sri Ponni is very professional and caring. They treated my father with great patience and the hospital was very clean and well maintained."
  },
  {
    name: "Meenakshi Ramasamy",
    label: "Happy Patient",
    image: p2,
    text: "I had a very good experience with the surgery here. The cost was reasonable compared to other big hospitals and the doctors provided excellent care throughout my stay."
  },
  {
    name: "Saravanan K",
    label: "Happy Patient",
    image: p3,
    text: "We always visit Sri Ponni for our children's health needs. The doctors are expert and the staff is very friendly, making the hospital visit easy and stress-free for us."
  }
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="testimonial-section overflow-hidden">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="testimonial-header">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="testimonial-subtitle"
          >
            <span className="dot"></span>
            Our Service & Testimonial
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="testimonial-title"
          >
            Service & Reviews
          </motion.h2>
        </div>

        <div className="testimonial-container">
          {/* Left: Doctor Image */}
          <div className="testimonial-left">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="doctor-img-wrapper"
            >
              <div className="doctor-bg-shape"></div>
              <motion.img
                src={doctorImg}
                alt="Review Doctor"
                className="doctor-main-img"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          </div>

          {/* Right: Reviews */}
          <div className="testimonial-right">
            <div className="quote-icon-large">
              <FaQuoteRight />
            </div>

            <div className="patient-thumbnails">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={idx}
                  className={`thumb-item ${currentIndex === idx ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <p className="testimonial-text">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="testimonial-stars">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>

                <div className="author-info">
                  <div className="author-details">
                    <img src={testimonials[currentIndex].image} alt="" className="author-img" />
                    <div>
                      <h3 className="author-name">{testimonials[currentIndex].name}</h3>
                      <span className="author-label">{testimonials[currentIndex].label}</span>
                    </div>
                  </div>

                  <div className="slider-nav">
                    <div className="nav-btn" onClick={prevSlide}>
                      <FaChevronLeft />
                    </div>
                    <div className="nav-btn" onClick={nextSlide}>
                      <FaChevronRight />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
