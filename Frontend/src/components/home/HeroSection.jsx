import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import heroImg from "../../assets/heroimg.png";
import "./HeroSection.css";

const SLIDES = [
  {
    badge: "YOUR HEALTH, OUR PRIORITY",
    title: "Trusted Medical Care\nYou Can Rely On",
  },
  {
    badge: "EXPERT SPECIALISTS",
    title: "Dedicated Doctors\nFor Every Need",
  },
  {
    badge: "24/7 EMERGENCY CARE",
    title: "Always Here\nWhen It Matters Most",
  },
];

const SOCIALS = ["FACEBOOK", "TWITTER", "LINKEDIN", "INSTAGRAM"];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="hero">
      {/* Background image */}
      <img src={heroImg} alt="" className="hero__bg" aria-hidden="true" />

      {/* Dark overlay */}
      <div className="hero__overlay" />

      {/* LEFT — vertical social links */}
      <div className="hero__socials">
        {SOCIALS.map((s) => (
          <a key={s} href="#" className="hero__social-link" aria-label={s}>
            {s}
          </a>
        ))}
      </div>

      {/* CENTER — content */}
      <div className="hero__content">
        <span className="hero__badge">{SLIDES[active].badge}</span>

        <h1 className="hero__title">
          {SLIDES[active].title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h1>

        <Link to="/contact" className="hero__cta">
          Book Appointment
          <span className="hero__cta-icon">
            <FiArrowUpRight />
          </span>
        </Link>
      </div>

      {/* RIGHT — dot navigation */}
      <div className="hero__dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === active ? " hero__dot--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
