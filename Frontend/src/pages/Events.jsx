import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import EventCard from '../components/events/EventCard';
import PageHero from '../components/common/PageHero';
import eventsHeroImg from '../assets/events_hero_bg.webp';

import { config } from '../config';

const API_URL = config.API_URL;
const CATEGORIES = ["ALL", "HEALTH CAMP", "SEMINAR", "AWARENESS", "BLOOD DONATION"];

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('upcoming'); // 'upcoming' or 'completed'
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Filter logic
    const filteredEvents = events.filter(event => {
        // Tab match
        if (event.status !== tab) return false;
        
        // Category match
        if (activeCategory !== 'ALL' && event.category !== activeCategory) return false;
        
        // Search match
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (event.title && event.title.toLowerCase().includes(query)) || 
                   (event.description && event.description.toLowerCase().includes(query)) ||
                   (event.location && event.location.toLowerCase().includes(query));
        }
        
        return true;
    });

    return (
        <div className="events-page bg-[#fafafb] min-h-screen">
            <SEO 
                title="Events & Health Camps | Sri Ponni Medical Centre"
                description="Discover upcoming and completed health camps, medical seminars, and awareness programs at Sri Ponni Medical Centre, Velur."
            />
            
            <PageHero 
                title="Medical Events" 
                bgImage={eventsHeroImg} 
            />

            <div className="container mx-auto px-4 lg:px-8 max-w-7xl pb-24 mt-12">
                
                {/* 1. Tab Switcher */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex items-center p-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                        <button
                            onClick={() => setTab('upcoming')}
                            className={`px-6 lg:px-10 py-3.5 rounded-full text-sm font-bold font-sans tracking-widest uppercase transition-all duration-300 ${
                                tab === 'upcoming' 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-gray-500 hover:text-gray-900 bg-transparent'
                            }`}
                        >
                            Upcoming Events
                        </button>
                        <button
                            onClick={() => setTab('completed')}
                            className={`px-6 lg:px-10 py-3.5 rounded-full text-sm font-bold font-sans tracking-widest uppercase transition-all duration-300 ${
                                tab === 'completed' 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-gray-500 hover:text-gray-900 bg-transparent'
                            }`}
                        >
                            Completed Events
                        </button>
                    </div>
                </div>

                {/* 2. Filters & Search Row */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-12">
                    
                    {/* Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 mr-auto w-full xl:w-auto">
                        {CATEGORIES.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-widest uppercase transition-all duration-200 ${
                                    activeCategory === category
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-white border border-gray-200 text-[#475b75] hover:border-primary hover:text-primary'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-[350px] xl:w-[300px] shrink-0">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400 text-lg" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search happenings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-12 pr-5 py-3.5 border border-gray-200 bg-white rounded-full text-sm font-sans placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* 3. Event Grid */}
                <AnimatePresence mode="wait">
                    {filteredEvents.length > 0 ? (
                        <motion.div 
                            key={`grid-${tab}-${activeCategory}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
                        >
                            {filteredEvents.map((event, index) => (
                                <EventCard key={event.id} event={event} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24 bg-white rounded-[2rem] border border-gray-100 shadow-sm"
                        >
                            <h3 className="text-2xl font-bold font-heading text-gray-800 mb-2">No Events Found</h3>
                            <p className="text-gray-500">We couldn't find any events matching your criteria.</p>
                            <button 
                                onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
                                className="mt-6 px-6 py-2.5 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary hover:text-white transition-colors"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default Events;
