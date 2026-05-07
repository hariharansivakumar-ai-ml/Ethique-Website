import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiExternalLink, FiPhone } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import { config } from '../config';

const API_URL = config.API_URL;

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvent(data);
                } else {
                    console.error("Failed to fetch event");
                }
            } catch (err) {
                console.error("Failed to fetch event:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);



    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fafafb]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    }

    if (!event) {
        return <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafb]">
            <h1 className="text-3xl font-bold text-gray-800">Event Not Found</h1>
            <button onClick={() => navigate('/events')} className="mt-4 px-6 py-2 bg-primary text-white rounded-full">Go Back</button>
        </div>;
    }

    // Helper to extract correctly formatted embed URL from anything the user pastes
    const extractSrc = (str) => {
        if (!str) return null;
        let url = str.trim();
        
        // 1. If it's a full iframe tag, extract the src attribute
        if (url.includes('<iframe')) {
            const match = url.match(/src=["'](.*?)["']/i);
            url = match ? match[1] : url;
        }

        // 2. If it's a regular Google Maps link (not embed), try to convert it
        // Example: https://www.google.com/maps/place/Sri+Ponni+Medical+Centre...
        // Convert to: https://www.google.com/maps/embed/v1/place?key=API_KEY&q=... (Hard without API key)
        // Better: Just ensure it's an embed URL or warn. 
        // Most common mistake: pasting the share link instead of the embed code.
        
        // 3. Ensure it starts with https:
        if (url.startsWith('//')) url = 'https:' + url;
        if (!url.startsWith('http')) url = 'https://' + url;

        return url;
    };

    // Real data from database with fallbacks
    const hours = event.hours || "Hours to be announced";
    const detailedAddress = event.address || event.location || "Address to be announced";
    const hostName = event.host_name || "Sri Ponni Admin";
    const googleMapSrc = extractSrc(event.map_url) || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3911.83!2d77.72!3d11.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDIxJzAwLjAiTiA3N8KwNDMnMTIuMCJF!5e0!3m2!1sen!2sin!4v1655555555555!5m2!1sen!2sin";

    return (
        <div className="min-h-screen bg-[#fafafb] pb-20 font-sans font-sans">
            <SEO title={`${event.title} | Sri Ponni Events`} description={event.description} />
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                {/* Hero Image Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-[95%] lg:w-[90%] mx-auto h-auto rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden mb-12 shadow-md"
                >
                    <img
                        src={event.image_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"}
                        alt={event.title}
                        className="w-full h-auto block"
                    />

                </motion.div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 xl:gap-14">

                    {/* LEFT COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col"
                    >
                        {/* Main Title */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-[#0f172a] mb-10 tracking-tight leading-tight">
                            {event.title}
                        </h1>

                        {/* Overview Card */}
                        <div className="relative bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-16">
                            {/* Floating Top Right Icon Pill */}
                            <div className="absolute -top-6 right-10 bg-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg rotate-12 hover:rotate-0 transition-transform duration-300">
                                <FiCalendar className="text-2xl text-white" />
                            </div>

                            <h3 className="text-xs font-bold font-sans text-gray-400 tracking-[0.2em] uppercase mb-6">
                                Overview
                            </h3>

                            <div className="prose prose-lg max-w-none text-gray-500 italic mb-8">
                                <p className="leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            {/* Hashtags placeholder */}
                            <div className="flex flex-wrap gap-2 text-[#64748b] font-medium text-sm">
                                <span>#{event.category.replace(/\s+/g, '')}2026</span>
                                <span>#SriPonniMedical</span>
                                <span>#HealthFirst</span>
                                <span>#CommunityCare</span>
                            </div>
                        </div>

                        {/* The Destination Section */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 text-primary">
                                        <FiMapPin className="text-xl" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-heading text-[#0f172a]">The Destination</h2>
                                </div>
                                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold font-sans text-primary tracking-widest uppercase hover:text-primary transition-colors">
                                    GET DIRECTIONS <FiExternalLink />
                                </a>
                            </div>

                            {/* Map Container */}
                            <div className="w-full h-[400px] bg-white rounded-[3rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                                <iframe
                                    src={googleMapSrc}
                                    className="w-full h-full rounded-[2.5rem] bg-gray-100"
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Event Location Map"
                                ></iframe>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT COLUMN */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col gap-8"
                    >
                        {/* Timelines Black Card */}
                        <div className="bg-[#0a1a2f] rounded-[3rem] p-10 shadow-2xl flex flex-col pt-12 pb-14 text-white hover:-translate-y-2 transition-transform duration-500">
                            <h3 className="text-xs font-extrabold tracking-[0.2em] uppercase text-gray-400 mb-10 pl-2">
                                TIMELINES
                            </h3>

                            <div className="flex flex-col gap-10">
                                {/* The Date */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full border border-gray-800 border-t-gray-600 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                        <FiCalendar className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold font-sans tracking-[0.2em] text-blue-200/70 uppercase mb-2">THE DATE</h4>
                                        <p className="text-base font-semibold font-heading leading-tight">{event.date}</p>
                                    </div>
                                </div>

                                {/* The Hours */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full border border-gray-800 border-t-gray-600 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                        <FiClock className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold font-sans tracking-[0.2em] text-blue-200/70 uppercase mb-2">THE HOURS</h4>
                                        <p className="text-base font-semibold font-heading leading-tight">{hours}</p>
                                    </div>
                                </div>

                                {/* The Spot */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full border border-gray-800 border-t-gray-600 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                        <FiMapPin className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold font-sans tracking-[0.2em] text-blue-200/70 uppercase mb-2">THE SPOT</h4>
                                        <p className="text-base font-semibold font-heading leading-tight">{event.location}</p>
                                    </div>
                                </div>

                                {/* The Address */}
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-full border border-gray-800 border-t-gray-600 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                                        <FiMapPin className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-bold font-sans tracking-[0.2em] text-blue-200/70 uppercase mb-2">THE ADDRESS</h4>
                                        <p className="text-sm font-normal font-sans text-gray-400 leading-relaxed pr-4">{detailedAddress}</p>
                                    </div>
                                </div>

                                {/* Contact Entry */}
                                {event.contact_number && (
                                    <div className="flex gap-6 mt-8 pt-6 border-t border-gray-100 group">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-200/50 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                            <FiPhone className="text-xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold font-sans tracking-[0.2em] text-blue-200/70 uppercase mb-2">THE CONTACT</h4>
                                            <a href={`tel:${event.contact_number.replace(/\s+/g, '')}`} className="text-base font-semibold font-heading leading-tight hover:text-primary transition-colors">
                                                {event.contact_number}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Host Info Card */}
                        <div className="bg-white rounded-[3rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col">
                            <h3 className="text-base font-extrabold font-heading text-[#111827] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-primary flex items-center justify-center">
                                    <FiUser />
                                </div>
                                <div>
                                    Host Info
                                    <span className="block text-[10px] items-center text-primary/70 tracking-[0.2em] uppercase mt-1">ORGANIZED EVENT</span>
                                </div>
                            </h3>
                            <div className="mt-6 p-4 bg-[#fafafb] rounded-2xl flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400">
                                    <FiUser />
                                </div>
                                <span className="font-bold text-[#111827]">{hostName}</span>
                            </div>
                        </div>

                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default EventDetail;
