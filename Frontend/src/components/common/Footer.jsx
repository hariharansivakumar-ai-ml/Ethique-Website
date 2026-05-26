import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaYoutube } from "react-icons/fa";
import logoImg from "../../assets/Ethique Hospital Logo.jpeg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container mx-auto px-4 sm:px-12">
        
        {/* Appointment CTA Overlap */}
        <div className="newsletter-box flex flex-col items-center justify-center text-center">
          <h3 className="newsletter-title">Get Trusted Medical Care <br /> At Ethique Hospitals</h3>
          <p className="text-white/80 text-sm max-w-2xl mt-2 leading-relaxed">
            Ethique Hospitals is committed to delivering safe, compassionate, and advanced healthcare services with a strong focus on patient comfort and medical excellence.
          </p>
        </div>

        <div className="footer-main">
          <div className="footer-grid">
            
            {/* Col 1: About */}
            <div className="footer-about">
              <Link to="/">
                <img src={logoImg} alt="Ethique Hospital" className="h-24 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="footer-description">
                Ethique Hospitals provides trusted healthcare services through experienced doctors, advanced technology, and compassionate patient care in a safe and modern medical environment.
              </p>
              <div className="footer-socials">
                <a href="#" className="social-icon"><FaFacebookF /></a>
                <a href="#" className="social-icon"><FaInstagram /></a>
                <a href="#" className="social-icon"><FaLinkedinIn /></a>
                <a href="#" className="social-icon"><FaYoutube /></a>
              </div>
            </div>

            {/* Col 2: Services */}
            <div className="hidden md:block">
              <h4 className="footer-col-title">Our Services</h4>
              <ul className="footer-links">
                <li><Link to="/services">Emergency Care</Link></li>
                <li><Link to="/services">Diagnostics & Imaging</Link></li>
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
                  <p>info@ethiquehospitals.com</p>
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
            © {new Date().getFullYear()} Ethique Hospitals. All Rights Reserved.
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
