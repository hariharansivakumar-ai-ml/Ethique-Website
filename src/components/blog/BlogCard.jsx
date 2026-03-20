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
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col h-full group"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={blog.image_url || blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6">
          <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-6 text-gray-400 text-xs font-semibold mb-4">
          <div className="flex items-center gap-2">
            <FiCalendar className="text-primary" />
            <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : blog.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiUser className="text-primary" />
            <span>{blog.author}</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#0e3d64] mb-4 group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="mt-auto">
          <Link
            to={`/blog/${blog.id}`}
            className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all"
          >
            Read More
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
