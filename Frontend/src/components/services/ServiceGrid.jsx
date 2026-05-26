import React from 'react';
import { motion } from 'framer-motion';
import { 
    FiActivity, FiHeart, FiStar, FiSun, FiAlertCircle, 
    FiUser, FiTarget, FiPlus, FiScissors, FiRefreshCw, 
    FiDroplet, FiZap, FiShield, FiEye, FiCodepen,
    FiUserPlus, FiLifeBuoy, FiSmile, FiCpu, FiMove,
    FiWind, FiCamera, FiLayers, FiFilter
} from 'react-icons/fi';
import './ServiceGrid.css';

const servicesContent = [
    {
        title: "Anesthesiology",
        description: "Our anesthesiology specialists provide safe and effective pain management, advanced surgical support, and continuous patient monitoring to ensure comfort and safety before, during, and after medical procedures.",
        icon: <FiActivity />
    },
    {
        title: "Cardiology",
        description: "Comprehensive heart care services focused on early diagnosis, preventive cardiology, advanced treatment, and long-term cardiovascular wellness for patients of all ages.",
        icon: <FiHeart />
    },
    {
        title: "Dentistry",
        description: "Complete dental healthcare services including preventive care, cosmetic dentistry, restorative treatments, and oral health solutions using modern dental technology.",
        icon: <FiSmile />
    },
    {
        title: "Dermatology",
        description: "Advanced skin, hair, and nail treatments designed to improve skin health, manage chronic conditions, and provide aesthetic care with personalized treatment plans.",
        icon: <FiSun />
    },
    {
        title: "Emergency Care",
        description: "24/7 emergency medical support with rapid response teams, advanced critical care facilities, and immediate treatment for urgent medical conditions and trauma cases.",
        icon: <FiAlertCircle />
    },
    {
        title: "ENT",
        description: "Expert care for ear, nose, and throat conditions including allergies, infections, hearing disorders, sinus problems, and voice-related concerns.",
        icon: <FiUser />
    },
    {
        title: "Endocrinology",
        description: "Specialized treatment for hormonal and metabolic disorders including diabetes, thyroid conditions, and endocrine health management through advanced care solutions.",
        icon: <FiTarget />
    },
    {
        title: "General Medicine",
        description: "Comprehensive healthcare services focused on preventive care, chronic disease management, accurate diagnosis, and overall patient wellness.",
        icon: <FiPlus />
    },
    {
        title: "General Surgery",
        description: "Advanced surgical procedures performed with precision, safety, and modern minimally invasive techniques to support faster recovery and improved outcomes.",
        icon: <FiScissors />
    },
    {
        title: "Gastroenterology",
        description: "Specialized digestive healthcare services for stomach, liver, intestinal, and gastrointestinal conditions using advanced diagnostics and treatment methods.",
        icon: <FiRefreshCw />
    },
    {
        title: "Nephrology",
        description: "Expert kidney care services for managing kidney disorders, chronic kidney disease, infections, and renal health with personalized treatment approaches.",
        icon: <FiDroplet />
    },
    {
        title: "Neurology",
        description: "Comprehensive neurological care for conditions affecting the brain, spine, and nervous system supported by advanced diagnostic technology and expert specialists.",
        icon: <FiZap />
    },
    {
        title: "Oncology",
        description: "Compassionate cancer care focused on early detection, advanced treatment therapies, recovery support, and personalized patient-centered oncology services.",
        icon: <FiShield />
    },
    {
        title: "Ophthalmology",
        description: "Complete eye care services including vision correction, eye disease treatment, preventive screenings, and advanced surgical procedures for long-term eye health.",
        icon: <FiEye />
    },
    {
        title: "Orthopaedics",
        description: "Specialized treatment for bone, joint, muscle, and spine conditions with modern therapies, rehabilitation programs, and advanced orthopedic procedures.",
        icon: <FiCodepen />
    },
    {
        title: "Obstetrics & Gynaecology",
        description: "Comprehensive women’s healthcare services including maternity care, pregnancy support, fertility treatment, gynecological consultations, and preventive wellness care.",
        icon: <FiUserPlus />
    },
    {
        title: "Palliative Care",
        description: "Supportive and compassionate medical care focused on pain relief, symptom management, emotional support, and improving quality of life for patients.",
        icon: <FiLifeBuoy />
    },
    {
        title: "Pediatrics",
        description: "Dedicated healthcare services for infants, children, and adolescents focused on healthy growth, preventive care, vaccinations, and child wellness.",
        icon: <FiSmile />
    },
    {
        title: "Psychiatry",
        description: "Professional mental healthcare services providing counseling, emotional support, therapy, and treatment for stress, anxiety, depression, and behavioral conditions.",
        icon: <FiCpu />
    },
    {
        title: "Physiotherapy",
        description: "Rehabilitation and physical therapy programs designed to restore mobility, reduce pain, improve strength, and support recovery after injuries or surgeries.",
        icon: <FiMove />
    },
    {
        title: "Pulmonology",
        description: "Advanced respiratory care services for asthma, lung infections, breathing disorders, and chronic pulmonary conditions with modern treatment solutions.",
        icon: <FiWind />
    },
    {
        title: "Radiology & Imaging",
        description: "High-quality diagnostic imaging services including MRI, CT scans, ultrasound, digital X-rays, and advanced radiology support for accurate medical evaluation.",
        icon: <FiCamera />
    },
    {
        title: "Rheumatology",
        description: "Specialized care for arthritis, autoimmune disorders, joint pain, and musculoskeletal conditions focused on improving mobility and quality of life.",
        icon: <FiLayers />
    },
    {
        title: "Urology",
        description: "Expert urological care for kidney stones, urinary tract conditions, prostate disorders, bladder health, and male reproductive wellness.",
        icon: <FiFilter />
    }
];

const ServiceGrid = () => {
    return (
        <section className="service-grid-section py-24 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#376e80] font-bold uppercase tracking-widest text-sm">Main Specialties</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#103354]">Specialized Medical Services</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        Comprehensive healthcare solutions tailored to deliver safe, advanced, and compassionate medical care.
                    </p>
                </div>

                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {servicesContent.map((service, index) => (
                        <motion.div 
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="service-card group bg-white p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
                        >
                            <div className="service-icon-box w-20 h-20 bg-[#eef5f7] text-[#376e80] rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:bg-[#376e80] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-[#103354] mb-4 group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed text-[15px] flex-grow">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ServiceGrid;
