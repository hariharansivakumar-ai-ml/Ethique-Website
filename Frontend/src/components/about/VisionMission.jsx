import React from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiTarget } from 'react-icons/fi';
import './VisionMission.css';

const VisionMission = () => {
  const data = [
    {
      title: "Our Mission",
      icon: <FiTarget size={40} />,
      content: "We are committed not just to treatment, but to fostering hope, strength, and well-being. Our passion extends to education and innovation, where we train the next generation of medical professionals to carry forward our legacy of excellence.",
      delay: 0.2
    },
    {
      title: "Our Vision",
      icon: <FiEye size={40} />,
      content: "At Sri Ponni Medical Centre, we believe healthcare goes beyond treating illnesses—it’s about caring for people with compassion, trust, and expertise. Our vision is to bring world-class medical care closer to home, where every patient is treated with kindness, dignity, and personalized attention.",
      delay: 0.4
    }
  ];

  return (
    <section className="vision-mission-section py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: item.delay }}
              viewport={{ once: true }}
              className="vm-card group"
            >
              <div className="vm-icon-wrapper">
                {item.icon}
              </div>
              <h3 className="vm-title">{item.title}</h3>
              <p className="vm-content">{item.content}</p>
              <div className="vm-decoration" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
