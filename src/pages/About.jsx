import PageHero from '../components/common/PageHero';
import AboutContent from '../components/about/AboutContent';
import AboutValues from '../components/about/AboutValues';
import AboutVideoCTA from '../components/about/AboutVideoCTA';
import FaqSection from '../components/common/FaqSection';
import aboutHeroImg from '../assets/about Hero.png';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <PageHero 
        title="About Us"
        subtitle="Committed to providing world-class healthcare with compassion, expertise, and advanced medical technology since 1998."
        bgImage={aboutHeroImg}
      />
      
      <AboutContent />
      <AboutValues />
      <AboutVideoCTA />
      <FaqSection />
      
      {/* Additional sections can be added here later */}
    </div>
  );
};

export default About;
