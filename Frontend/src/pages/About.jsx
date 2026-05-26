import PageHero from '../components/common/PageHero';
import AboutContent from '../components/about/AboutContent';
import AboutValues from '../components/about/AboutValues';
import AboutVideoCTA from '../components/about/AboutVideoCTA';
import FaqSection from '../components/common/FaqSection';
import aboutHeroImg from '../assets/about Hero.webp';
import './About.css';

const aboutFaqs = [
  {
    question: "What healthcare services are available at Ethique Hospitals?",
    answer: "We provide comprehensive medical services including emergency care, diagnostics & imaging, general medicine, cardiology, orthopaedics, pediatrics, and neurology."
  },
  {
    question: "How can I book an appointment with a specialist?",
    answer: "You can schedule an appointment by clicking the 'Book Appointment' button on our website or by contacting our helpdesk directly."
  },
  {
    question: "Do you provide emergency and critical care services?",
    answer: "Yes, we offer 24/7 emergency support with a dedicated trauma team, advanced ICU monitoring, and critical care units for urgent medical needs."
  },
  {
    question: "Are advanced diagnostic facilities available?",
    answer: "Absolutely. Our diagnostics department is equipped with modern imaging scans and laboratory services for precise and early evaluation."
  },
  {
    question: "Does Ethique Hospitals offer personalized patient care?",
    answer: "Yes, we focus on patient-centered healthcare, designing personalized treatment plans around your safety, comfort, and recovery."
  }
];

const About = () => {
  return (
    <div className="about-page">
      <PageHero 
        title="Dedicated To Advanced Healthcare & Healing"
        subtitle="Delivering trusted medical care with compassion, innovation, and excellence through experienced specialists and modern healthcare technology."
        bgImage={aboutHeroImg}
      />
      
      <AboutContent />
      <AboutValues />
      <AboutVideoCTA />
      <FaqSection faqs={aboutFaqs} />
      
      {/* Additional sections can be added here later */}
    </div>
  );
};

export default About;
