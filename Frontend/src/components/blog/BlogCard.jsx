import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";
import { motion } from "framer-motion";

const BlogCard = ({ blog }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 border border-gray-50 flex flex-col h-full group"
    >
      <div className="relative h-64 overflow-hidden bg-gray-100" aria-hidden="true">
        <img
          src={blog.image_url || blog.image}
          alt={blog.image_alt || blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-4 text-gray-500 text-xs font-medium mb-4">
          <div className="flex items-center gap-1.5">
            <FiCalendar className="text-gray-400" />
            <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : blog.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUser className="text-gray-400" />
            <span>{blog.author}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3 text-sm">
          {blog.content 
            ? blog.content
                .replace(/<[^>]*>/g, ' ')
                .replace(/&nbsp;|\u00A0/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .trim()
                .substring(0, 150) + '...' 
            : ''}
        </p>

        <div className="mt-auto">
          <Link
            to={`/blog/${blog.id}`}
            aria-label={`Read more about ${blog.title}`}
            className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -ml-1"
          >
            Read More
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
