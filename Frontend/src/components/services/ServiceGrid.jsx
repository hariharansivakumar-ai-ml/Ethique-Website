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
        description: "Our Anesthesiology department delivers safe, precise, and compassionate care for patients undergoing surgeries, procedures, and critical treatments. With advanced monitoring and modern techniques, our specialists ensure comfort, pain control, and a smooth recovery at every stage.",
        icon: <FiActivity />
    },
    {
        title: "Cardiology",
        description: "Cardiology focuses on the diagnosis and treatment of heart problems, from routine check-ups to advanced care. Using modern tests and proven treatments, the team works to improve heart health, manage risks, and support patients through every stage of recovery.",
        icon: <FiHeart />
    },
    {
        title: "Dentistry",
        description: "Provides complete dental care including check-ups, cleaning, fillings, extractions, root canal treatments, and cosmetic procedures. Uses modern equipment and gentle techniques to ensure healthy teeth, a confident smile, and patient comfort at every visit.",
        icon: <FiSmile />
    },
    {
        title: "Dermatology",
        description: "Treats a wide range of skin, hair, and nail concerns with advanced care and modern techniques. From acne treatments and allergy control to cosmetic enhancements and laser therapies, the focus is on restoring health, improving appearance, and ensuring long-term skin wellness.",
        icon: <FiSun />
    },
    {
        title: "Emergency Care",
        description: "24/7 medical support for accidents, injuries, and sudden health problems. With quick response, advanced equipment, and experienced doctors, emergencies are handled with speed, safety, and expert care to stabilize patients, prevent complications, and protect lives.",
        icon: <FiAlertCircle />
    },
    {
        title: "ENT",
        description: "Specialized care for ear, nose, and throat problems including infections, hearing issues, allergies, sinus conditions, and voice disorders. With advanced diagnostic tools and skilled specialists, treatment focuses on quick relief, lasting recovery, and improved quality of life.",
        icon: <FiUser />
    },
    {
        title: "Endocrinology",
        description: "Caring for patients with hormone and metabolism concerns, including diabetes, thyroid problems, and hormonal imbalances. With accurate diagnosis, modern treatments, and ongoing guidance, the service helps maintain health, manage symptoms, and improve overall well-being.",
        icon: <FiTarget />
    },
    {
        title: "General Medicine",
        description: "Caring for everyday health needs, from minor illnesses to chronic conditions. With timely check-ups, accurate diagnosis, and effective treatment, patients receive the right support to recover quickly, maintain good health, and prevent future problems.",
        icon: <FiPlus />
    },
    {
        title: "General Surgery",
        description: "Caring for patients who need surgical treatment, from small procedures to major operations. With skilled hands, advanced techniques, and attentive aftercare, every step is taken to ensure safety, comfort, and a smooth recovery.",
        icon: <FiScissors />
    },
    {
        title: "Gastroenterology",
        description: "Expert care for digestive health, treating issues of the stomach, liver, intestines, and more. With advanced tests, gentle procedures, and personalized treatment, the goal is to ease discomfort, restore balance, and help patients enjoy better everyday well-being.",
        icon: <FiRefreshCw />
    },
    {
        title: "Nephrology",
        description: "Focused care for kidney health, managing conditions such as kidney stones, infections, and chronic kidney disease. With accurate diagnosis, advanced treatments, and ongoing guidance, the aim is to protect kidney function, improve health, and enhance quality of life.",
        icon: <FiDroplet />
    },
    {
        title: "Neurology",
        description: "Care for brain, spine, and nerve-related problems such as headaches, stroke, seizures, and movement disorders. With modern scans, expert guidance, and tailored treatment, the goal is to relieve symptoms, improve daily function, and support long-term health.",
        icon: <FiZap />
    },
    {
        title: "Oncology",
        description: "Delivers advanced cancer care with a focus on early diagnosis, effective treatment, and continuous support. Combines modern therapies, advanced technology, and expert guidance to achieve the best possible outcomes and support patients through every stage of care.",
        icon: <FiShield />
    },
    {
        title: "Opthalmology",
        description: "Complete eye care service covering vision checks, treatment for eye diseases, and corrective surgeries. With advanced diagnostic tools, laser technology, and skilled specialists, the focus is on protecting sight, treating conditions early, and ensuring long-term eye health for all ages.",
        icon: <FiEye />
    },
    {
        title: "Orthopaedics",
        description: "Specialized in treating injuries and conditions affecting bones, joints, and muscles. Whether it’s a fracture, joint pain, or a sports injury, care is given using advanced diagnostics, modern therapies, and surgical expertise to help patients regain strength and move comfortably.",
        icon: <FiCodepen />
    },
    {
        title: "Obstetrics & Gynaecology",
        description: "Maternity care, safe delivery, infertility treatment, menstrual disorder management, and advanced gynaecological surgeries. Provides complete women’s health services with expert care, personalised treatment, and modern facilities to ensure safety, comfort, and well-being at every stage of life.",
        icon: <FiUserPlus />
    },
    {
        title: "Palliative Care",
        description: "Pain relief, symptom control, emotional support, and comfort care for patients with serious or life-limiting illnesses. Focus on dignity, personalised attention, and better quality of life through medical management, counselling, and advanced care.",
        icon: <FiLifeBuoy />
    },
    {
        title: "Pediatrics",
        description: "Care for babies, children, and teens to keep them healthy and growing strong. Services include regular check-ups, vaccinations, illness treatment, and growth tracking. With gentle care, early diagnosis, and a focus on overall well-being, children are supported at every stage of development.",
        icon: <FiSmile />
    },
    {
        title: "Psychiatry",
        description: "Helping individuals manage and overcome mental health challenges with care and understanding. Services include evaluation, counselling, therapy sessions, and treatment for issues like anxiety, depression, stress, and mood disorders, aiming for better mental strength and stability.",
        icon: <FiCpu />
    },
    {
        title: "Physiotherapy",
        description: "A physiotherapist provides care for injury rehabilitation, joint and muscle pain relief, mobility improvement, posture correction, and strengthening programs. Using exercises, hands-on therapy, and modern rehab techniques, patients regain movement and return to daily activities.",
        icon: <FiMove />
    },
    {
        title: "Pulmonology",
        description: "Treatment for lung and breathing problems, including asthma, bronchitis, COPD, and respiratory infections. Pulmonology focuses on improving breathing, managing symptoms, and supporting overall lung health with advanced care and therapies.",
        icon: <FiWind />
    },
    {
        title: "Radiology & Imaging",
        description: "Advanced imaging services including X-rays, CT scans, MRI, and ultrasound for accurate diagnosis and treatment planning. Expert radiologists use modern technology to detect conditions early, monitor progress, and guide effective medical care for patients.",
        icon: <FiCamera />
    },
    {
        title: "Rheumatology",
        description: "Helps with joint, muscle, and bone problems, including arthritis, autoimmune issues, and long-term pain. Rheumatologists guide exercises, medications, and therapies to ease discomfort, improve movement, and keep patients active and healthy.",
        icon: <FiLayers />
    },
    {
        title: "Urology",
        description: "Kidney stone removal, urinary infection care, prostate and bladder management, and men’s reproductive health. Includes advanced tests, minimally invasive procedures, and support to restore normal function and relieve discomfort effectively.",
        icon: <FiFilter />
    }
];

const ServiceGrid = () => {
    return (
        <section className="service-grid-section py-24 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-20">
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#13a078] font-bold uppercase tracking-widest text-sm">Main Specialties</span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0e3d64]">Our Medical Services</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                        We provide comprehensive medical care with a focus on empathy, 
                        integrity, and excellence across all our specialized departments.
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
                            <div className="service-icon-box w-20 h-20 bg-[#ebf7f4] text-[#13a078] rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:bg-[#13a078] group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-[#0e3d64] mb-4 group-hover:text-primary transition-colors">
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
