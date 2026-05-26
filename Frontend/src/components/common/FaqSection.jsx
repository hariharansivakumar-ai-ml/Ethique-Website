import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import "./FaqSection.css";

const faqs = [
  {
    question: "What medical specialties are available at Ethique Hospitals?",
    answer: "We offer a wide range of specialties including Cardiology, Neurology, Nephrology, Gastroenterology, Orthopaedics, and General Surgery, led by a team of expert specialist doctors."
  },
  {
    question: "How can I schedule an appointment with a doctor?",
    answer: "You can book an appointment easily by clicking the 'Book Appointment' button on our website, or by contacting our hospital directly for immediate assistance."
  },
  {
    question: "Does Ethique Hospitals provide emergency medical services?",
    answer: "Yes, Ethique Hospitals is equipped with a dedicated emergency department and experienced emergency physicians to provide 24/7 immediate medical attention and safe patient-focused care."
  },
  {
    question: "Are advanced diagnostic and laboratory services available?",
    answer: "Our hospital features modern diagnostic services and a fully equipped laboratory, managed by experienced radiologists and technicians to provide accurate and reliable results for better treatment planning."
  },
  {
    question: "Do you offer personalized treatment and health consultations?",
    answer: "Yes, we focus on personalized treatment plans designed around each patient’s comfort, safety, and recovery, along with comprehensive medical consultations."
  }
];

const FaqSection = ({ faqs: customFaqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const activeFaqs = customFaqs || faqs;

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
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
          {activeFaqs.map((faq, index) => (
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
