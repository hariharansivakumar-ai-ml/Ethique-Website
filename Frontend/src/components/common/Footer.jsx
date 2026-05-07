import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaYoutube } from "react-icons/fa";
import logoImg from "../../assets/Sri-Ponni-Medical-Centre-scaled.webp";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container mx-auto px-4 sm:px-12">
        
        {/* Appointment CTA Overlap */}
        <div className="newsletter-box flex flex-col items-center justify-center text-center">
          <h3 className="newsletter-title">Get Expert Medical Care from Sri Ponni Medical Centre</h3>
        </div>

        <div className="footer-main">
          <div className="footer-grid">
            
            {/* Col 1: About */}
            <div className="footer-about">
              <Link to="/">
                <img src={logoImg} alt="Sri Ponni" className="h-24 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="footer-description">
                Sri Ponni Medical Center in Coimbatore provides affordable, high-quality medical care in a safe and patient-focused environment. We prioritize comfort and hygiene.
              </p>
              <div className="footer-socials">
                <a href="https://www.facebook.com/sriponnimedicalcentre" target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
                <a href="https://www.instagram.com/sriponnimedicalcentre/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
                <a href="https://www.linkedin.com/in/aravinth-subramanium-0290b492/" target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
                <a href="https://www.youtube.com/@SriPonniMedicalCentre" target="_blank" rel="noopener noreferrer" className="social-icon"><FaYoutube /></a>
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="hidden md:block">
              <h4 className="footer-col-title">Our Services</h4>
              <ul className="footer-links">
                <li><Link to="/services">Emergency Care</Link></li>
                <li><Link to="/services">Diagnostics & Labs</Link></li>
                <li><Link to="/services">General Medicine</Link></li>
                <li><Link to="/services">Orthopaedics</Link></li>
                <li><Link to="/services">Pediatrics</Link></li>
              </ul>
            </div>

            {/* Col 3: Quick Links */}
            <div className="hidden md:block">
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Appointment</Link></li>
                <li><Link to="/blog">Our Blog</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="footer-col-title">Contact Us</h4>
              <div className="footer-contact-item">
                <FaPhoneAlt className="footer-contact-icon" />
                <div className="footer-contact-text">
                  <span className="highlight">Phone Number</span>
                  <p>(+91) 78691 51300</p>
                  <p>93453 31564</p>
                  <p>98409 14694</p>
                </div>
              </div>
              <div className="footer-contact-item">
                <FaEnvelope className="footer-contact-icon" />
                <div className="footer-contact-text">
                  <span className="highlight">Email Address</span>
                  <p>sriponnimedicalcentre@gmail.com</p>
                </div>
              </div>
              <div className="footer-contact-item">
                <FaMapMarkerAlt className="footer-contact-icon" />
                <div className="footer-contact-text">
                  <span className="highlight">Location</span>
                  <p>Namakkal Road, Velur, Tamilnadu – 638182</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Sri Ponni Medical Centre. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
