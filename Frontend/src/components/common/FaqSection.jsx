import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import "./FaqSection.css";

const faqs = [
  {
    question: "What specialty medical services are available at Sri Ponni Medical Centre?",
    answer: "We offer a wide range of specialties including Cardiology, Neurology, Nephrology, Gastroenterology, Orthopaedics, and General Surgery, led by a team of expert specialist doctors in Coimbatore."
  },
  {
    question: "How can I book an appointment with a specialist doctor?",
    answer: "You can book an appointment easily by clicking the 'Book An Appointment' button on our website, or by calling our center directly at +91 (422) 255-5511 for immediate assistance."
  },
  {
    question: "Is Sri Ponni Medical Centre an affordable hospital in Coimbatore?",
    answer: "Yes, our primary goal is to provide high-quality, modern medical care at affordable rates, ensuring that excellence in healthcare is accessible to everyone in the local community."
  },
  {
    question: "Does the hospital provide emergency medical care?",
    answer: "Absolutely. Sri Ponni Medical Centre is equipped with a dedicated emergency department and experienced emergency physicians to provide 24/7 immediate medical attention and safe patient-focused care."
  },
  {
    question: "What diagnostic and laboratory facilities do you have?",
    answer: "Our hospital features modern diagnostic services and a fully equipped laboratory, managed by experienced radiologists and technicians to provide accurate and reliable results for better treatment planning."
  }
];

const FaqSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <section className="faq-section overflow-hidden" id="faq">
      <div className="container mx-auto px-4 sm:px-12">
        <div className="faq-header">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="faq-subtitle"
          >
            <span className="dot"></span>
            Common Questions
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="faq-title"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
              className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            >
              <motion.div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
                whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
              >
                <h3>{faq.question}</h3>
                <div className="faq-icon">
                  <FaChevronDown />
                </div>
              </motion.div>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="faq-answer overflow-hidden"
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
