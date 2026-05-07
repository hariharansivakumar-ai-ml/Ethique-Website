import PageHero from '../components/common/PageHero';
import ContactInfo from '../components/contact/ContactInfo';
import ContactForm from '../components/contact/ContactForm';
import contactHeroImg from '../assets/contact hero.webp';
import SEO from '../components/common/SEO';
import FaqSection from '../components/common/FaqSection';

const Contact = () => {
    return (
        <div className="contact-page">
            <SEO
                title="Contact Sri Ponni Medical Center Velur"
                description="Contact Sri Ponni Medical Center in Velur for appointments, emergency services, and healthcare support."
                keywords="Contact Hospital Velur, Book Appointment Velur"
            />
            
            <div className="sr-only">
                <h1>Contact Us</h1>
            </div>

            <PageHero 
                title="Contact Us"
                subtitle="We are here to help you. Reach out to us for appointments, inquiries, or any healthcare support you need."
                bgImage={contactHeroImg}
            />
            
            <ContactInfo />
            <ContactForm />
            <FaqSection />
        </div>
    );
};

export default Contact;
