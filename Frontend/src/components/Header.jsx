import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiPhone, FiArrowUpRight, FiMenu, FiX, FiMail } from "react-icons/fi";
import logoImg from "../assets/Ethique Hospital Logo.jpeg";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Events", path: "/events" },
    { name: "Blogs", path: "/blog" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <header className="fixed top-2 inset-x-4 sm:inset-x-8 z-50 h-20 text-black">
      <div className={`w-full h-full bg-white rounded-[1.5rem] flex items-center justify-between px-6 sm:px-10 shadow-sm transition-all duration-300 ${isScrolled ? 'shadow-lg bg-white/95 backdrop-blur-sm h-16' : ''}`}>
        {/* Logo - Always on the left */}
        <Link to="/" className="flex items-center py-2">
          <img 
            src={logoImg} 
            alt="Ethique Hospital" 
            className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-14'} w-auto object-contain`} 
          />
        </Link>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden xl:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative text-dark font-bold text-sm tracking-widest hover:text-primary transition-colors py-2 group`}
            >
              {link.name}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transition-all duration-300 transform origin-left ${location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </Link>
          ))}
        </nav>

        {/* Actions - Contains Mobile Menu Toggle on mobile */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 mr-4 group text-dark font-semibold">
            <div className="header-icon-circle group-hover:scale-110 h-10 w-10">
              <FiPhone className="text-sm" />
            </div>
            <span className="text-base whitespace-nowrap group-hover:text-primary transition-colors tracking-tight">xxxxxxxxxx</span>
          </div>

          <Link to="/contact" className="btn-appointment hidden lg:flex group">
            MAKE AN APPOINTMENT
            <FiArrowUpRight className="text-lg group-hover:rotate-45 transition-transform" />
          </Link>

          {/* Mobile Menu Toggle - Now on the right */}
          <button
            className="xl:hidden header-icon-circle p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[55] xl:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[60] xl:hidden flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Menu Header */}
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <FiMenu className="text-primary text-xl" />
                  </div>
                  <span className="font-bold text-dark text-xl">Quick Menu</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-8 py-10 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className="group flex items-center justify-between py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="flex flex-col">
                          <span className={`${location.pathname === link.path ? 'text-[#376e80]' : 'text-[#0f172a]'} text-base font-bold transition-colors`}>
                            {link.name}
                          </span>
                          <div className={`h-1 transition-all duration-300 rounded-full ${location.pathname === link.path ? 'w-full bg-[#376e80]' : 'w-0 bg-primary group-hover:w-full'}`} />
                        </div>
                        <FiArrowUpRight className={`${location.pathname === link.path ? 'text-[#376e80]' : 'text-gray-300'} group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all`} size={24} />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Contact Info in Menu */}
                <div className="mt-16 pt-10 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Contact Us</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-dark font-medium">
                      <div className="p-2 bg-gray-50 rounded-lg"><FiPhone size={18} className="text-[#376e80]" /></div>
                      <span>xxxxxxxxxx</span>
                    </div>
                    <div className="flex items-center gap-4 text-dark font-medium">
                      <div className="p-2 bg-gray-50 rounded-lg"><FiMail size={18} className="text-[#376e80]" /></div>
                      <span>xxxxxxxxxx</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="p-8 bg-gray-50 mt-auto">
                <Link 
                  to="/contact" 
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
