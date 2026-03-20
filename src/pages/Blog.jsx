import { useState, useEffect } from "react";
import PageHero from "../components/common/PageHero";
import BlogCard from "../components/blog/BlogCard";
import FaqSection from "../components/common/FaqSection";
import { blogService } from "../services/blogService";
import blogHeroImg from "../assets/Hero image.png"; // Using existing asset for hero

import { motion } from "framer-motion";

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

  useEffect(() => {
    blogService.getBlogs()
      .then(data => setBlogs(data))
      .catch(() => setBlogs([])
    );
  }, []);

  return (
    <div className="blog-page bg-gray-50 min-h-screen pb-24">
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
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </motion.div>
        
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
