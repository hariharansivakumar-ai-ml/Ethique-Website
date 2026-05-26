import Hero from "../components/Hero";
import SEO from "../components/common/SEO";
import AboutSection from "../components/home/AboutSection";
import ServicesSection from "../components/home/ServicesSection";
import WhyChooseUs from "../components/home/WhyChooseUs";
import TestimonialSection from "../components/home/TestimonialSection";
import FaqSection from "../components/common/FaqSection";

function Home() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans">
      <SEO
        title="Best Hospital in Velur | Ethique Hospitals"
        description="Ethique Hospitals is the best hospital in Velur offering affordable and high-quality healthcare with expert doctors and 24/7 emergency services."
        keywords="Hospital in Velur, Best Hospital Velur, 24/7 Hospital Velur, Ethique Hospitals"
      />
      
      <div className="sr-only">
        <h1>Best Hospital in Velur</h1>
        <h2>Affordable & High-Quality Healthcare</h2>
      </div>

      <Hero />
      <AboutSection />
      <ServicesSection />
      <WhyChooseUs />
      <TestimonialSection />
      <FaqSection />
    </div>
  );
}

export default Home;
