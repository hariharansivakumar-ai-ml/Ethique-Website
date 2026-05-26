import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import "./FaqSection.css";

const faqs = [
  {
    question: "What medical specialties are available at Ethique Hospitals?",
    answer: "We offer a wide range of specialized departments including Cardiology, Neurology, Orthopaedics, Oncology, Gastroenterology, Nephrology, and General Surgery, all led by highly experienced clinical experts."
  },
  {
    question: "How can I schedule a consultation with a specialist?",
    answer: "You can easily schedule a consultation by clicking the 'Book Appointment' button on our website, calling our patient helpdesk, or visiting Ethique Hospitals directly."
  },
  {
    question: "Does Ethique Hospitals provide emergency care services?",
    answer: "Yes, we provide 24/7 comprehensive emergency and trauma care equipped with state-of-the-art life support systems and a dedicated rapid-response medical team."
  },
  {
    question: "Are diagnostic and imaging services available?",
    answer: "Yes, Ethique Hospitals offers advanced diagnostic imaging services including MRI, CT scans, ultrasound, digital X-rays, and a fully automated pathology laboratory."
  },
  {
    question: "Do you offer personalized treatment plans for patients?",
    answer: "Absolutely. Our multidisciplinary team of doctors designs customized treatment plans tailored to each patient's unique medical history, comfort, and long-term recovery goals."
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
