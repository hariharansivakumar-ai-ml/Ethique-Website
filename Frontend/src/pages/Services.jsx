import ServiceHero from '../components/services/ServiceHero';
import ServiceGrid from '../components/services/ServiceGrid';
import SEO from '../components/common/SEO';
import FaqSection from '../components/common/FaqSection';

const Services = () => {
    return (
        <div className="services-page">
            <SEO
                title="Medical Services in Velur | Sri Ponni Medical Center"
                description="Explore medical services at Sri Ponni Medical Center in Velur including general consultation, emergency care, and lab services."
                keywords="Medical Services Velur, Hospital Services Velur"
            />
            
            <div className="sr-only">
                <h1>Medical Services in Velur</h1>
                <h2>Our Healthcare Services</h2>
            </div>

            <ServiceHero 
                title="Our Services" 
                subtitle="Expert Care, Empathy, and Excellence Across All Medical Specialties. Delivering World-Class Healthcare Closer to Home."
            />
            <ServiceGrid />
            <FaqSection />
        </div>
    );
};

export default Services;
