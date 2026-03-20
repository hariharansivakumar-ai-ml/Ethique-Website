import { motion } from "framer-motion";

function placeholder(name) {
  return function Page() {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}
      >
        <h1 style={{ fontFamily: "var(--font-heading)", color: "#0e548a", fontSize: "2.5rem" }}>{name}</h1>
        <p style={{ color: "#64748b" }}>This page is coming soon.</p>
      </motion.div>
    );
  };
}

export const About = placeholder("About Us");
export const Services = placeholder("Services");
export const Facilities = placeholder("Facilities");
export const Gallery = placeholder("Gallery");
export const Contact = placeholder("Contact Us");
