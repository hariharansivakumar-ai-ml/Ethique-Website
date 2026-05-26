import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './ContactInfo.css';

const contactDetails = [
    {
        icon: <FiPhone />,
        title: "Phone:",
        content: "xxxxxxxxxx",
        delay: 0.1
    },
    {
        icon: <FiMail />,
        title: "Email Address:",
        content: "xxxxxxxxxx",
        delay: 0.2
    },
    {
        icon: <FiMapPin />,
        title: "Our Address:",
        content: "xxxxxxxxxx",
        delay: 0.3
    }
];

const ContactInfo = () => {
    return (
        <section className="contact-info-section py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-20">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-gray-500 mb-10 text-center italic"
                >
                    To understand our treatments, visit our 
                    <Link to="/services" className="text-primary hover:underline font-bold ml-1">Services page</Link> or learn more 
                    <Link to="/about" className="text-primary hover:underline font-bold ml-1">about us</Link>.
                </motion.p>
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
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {contactDetails.map((item, index) => (
                        <motion.div 
                            key={index} 
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="contact-info-card bg-[#f0f9f9] p-10 rounded-[32px] text-center transition-all duration-300 hover:shadow-xl group"
                        >
                            <div className="contact-info-icon w-16 h-16 bg-white text-[#376e80] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm group-hover:bg-[#376e80] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#103354] mb-2">{item.title}</h3>
                            <p className="text-gray-500 font-medium">{item.content}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ContactInfo;
