import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiArrowUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const EventCard = ({ event, index }) => {
    // Determine status badge colors
    const isUpcoming = event.status === 'upcoming';
    const badgeBg = isUpcoming ? 'bg-primary/90 text-white' : 'bg-gray-600/90 text-white';

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <img 
                    src={event.image_url || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80"} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
                    <span className="text-xs font-bold font-sans text-white tracking-wider uppercase">
                        {event.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-grow p-6 lg:p-8">
                {/* Meta Row: Date & Location */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center text-xs font-semibold text-[#8ca1b9] tracking-widest uppercase gap-1.5">
                        <FiCalendar className="text-sm shrink-0" />
                        <span className="truncate">{event.date}</span>
                    </div>
                    {event.location && (
                        <div className="flex items-center text-xs font-bold font-sans text-primary uppercase tracking-widest gap-1">
                            <FiMapPin className="text-sm shrink-0" />
                            <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                    )}
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold font-heading text-[#0f172a] mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                </h3>
                
                <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                    {event.description}
                </p>

                {/* Action Link */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <Link 
                        to={`/events/${event.slug || event.id || '#'}`}
                        className="inline-flex items-center text-xs font-bold text-dark tracking-widest uppercase group/link"
                    >
                        VIEW DETAILS
                        <div className="ml-2 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover/link:bg-primary group-hover/link:border-primary group-hover/link:text-white transition-all">
                            <FiArrowUpRight className="text-sm group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
