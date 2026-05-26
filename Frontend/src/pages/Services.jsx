import { Link } from 'react-router-dom';
import ServiceHero from '../components/services/ServiceHero';
import ServiceGrid from '../components/services/ServiceGrid';
import SEO from '../components/common/SEO';
import FaqSection from '../components/common/FaqSection';

const Services = () => {
    return (
        <div className="services-page">
            <SEO
                title="Medical Services & Specialties | Ethique Hospitals"
                description="Explore the specialized medical departments and advanced healthcare services at Ethique Hospitals, designed to deliver safe, precise, and compassionate care."
                keywords="Medical Specialties, Ethique Hospitals, Cardiology, Orthopaedics, Pediatrics, Emergency Care"
            />
            
            <div className="sr-only">
                <h1>Our Medical Specialties</h1>
                <h2>Advanced Healthcare Services</h2>
            </div>

            <ServiceHero 
                title="Our Medical Specialties" 
                subtitle="Advanced Healthcare Services Delivered With Compassion, Precision, and Clinical Excellence."
                description="Ethique Hospitals provides comprehensive medical care across multiple specialties with experienced doctors, modern technology, and patient-focused treatment designed to support every stage of health and recovery."
                bottomText={
                    <>
                        Explore our specialized healthcare departments or <Link to="/contact" className="text-white hover:underline font-bold">contact Ethique Hospitals</Link> for expert medical consultation and personalized care.
                    </>
                }
            />
            <ServiceGrid />
            <FaqSection />
        </div>
    );
};

export default Services;
