import { useState, useEffect } from "react";
import PageHero from "../components/common/PageHero";
import BlogCard from "../components/blog/BlogCard";
import FaqSection from "../components/common/FaqSection";
import { blogService } from "../services/blogService";
import blogHeroImg from "../assets/blog_hero_premium.webp"; // Using new premium asset

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    blogService.getBlogs()
      .then(data => setBlogs(data))
      .catch(() => setBlogs([])
    );
  }, []);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  return (
    <div className="blog-page bg-gray-50 min-h-screen pb-24 font-sans">
      <PageHero
        title="Our Medical Blog"
        subtitle="Insights, tips, and the latest updates from our medical experts to help you live a healthier life."
        bgImage={blogHeroImg}
      />

      <div className="container mx-auto px-4 lg:px-20 mt-24">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {blogs.slice(0, visibleCount).map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>
        
        {blogs.length > visibleCount && (
          <div className="flex justify-center mt-20">
            <button
              onClick={loadMore}
              className="group flex items-center gap-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg shadow-primary/5 hover:shadow-primary/20"
            >
              LOAD MORE ARTICLES
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FiArrowRight className="rotate-90" />
              </motion.div>
            </button>
          </div>
        )}

        {blogs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl italic">No blog posts available at the moment.</p>
          </div>
        )}
      </div>
      <FaqSection />
    </div>
  );
};

export default Blog;
