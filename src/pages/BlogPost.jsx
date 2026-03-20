import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser, FiTag } from "react-icons/fi";
import { motion } from "framer-motion";
import FaqSection from "../components/common/FaqSection";
import { blogService } from "../services/blogService";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    blogService.getBlogById(id)
      .then(data => setBlog(data))
      .catch(() => setBlog(null));
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Post Not Found</h2>
          <Link to="/blog" className="text-primary hover:underline">Return to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Blog Hero Wrapper */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
        <img 
          src={blog.image_url || blog.image} 
          alt={blog.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e3d64]/90 via-[#0e3d64]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full pb-16 md:pb-24">
          <div className="container mx-auto px-4 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link to="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-white text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {blog.category}
                </span>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                   <div className="flex items-center gap-1.5 font-medium"><FiCalendar className="text-white" /> {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : blog.date}</div>
                   <div className="flex items-center gap-1.5 font-medium"><FiUser className="text-white" /> {blog.author}</div>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white max-w-4xl leading-tight">
                {blog.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container mx-auto px-4 lg:px-20 -mt-16 md:-mt-20 relative z-10 pb-24">
        <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl border border-gray-100">
          <article className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
             <div className="content-raw whitespace-pre-wrap">
               {blog.content}
             </div>
          </article>

          <footer className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap justify-between items-center gap-6">
            <div className="flex items-center gap-3">
               <FiTag className="text-primary" />
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{blog.category}</span>
            </div>
            
            <div className="flex gap-4">
               {/* Share Buttons could go here */}
            </div>
          </footer>
        </div>
      </div>
      <FaqSection />
    </div>
  );
};

export default BlogPost;
