import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { blogService } from "../../services/blogService";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await blogService.adminGetBlogs();
      // Filter out deleted blogs (backend does soft delete by setting is_deleted = True)
      setBlogs(data.filter(blog => !blog.is_deleted));
    } catch (err) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.adminDeleteBlog(id);
        loadBlogs();
      } catch (err) {
        alert(err.message || "Failed to delete post");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0e3d64]">Blog Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage your website's medical articles and updates.</p>
        </div>
        <Link 
          to="/admin/new" 
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <FiPlus />
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Post Details</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-8 py-5 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {blogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={blog.image_url || blog.image} 
                      alt="" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-bold text-[#0e3d64] group-hover:text-primary transition-colors">{blog.title}</div>
                      <div className="text-sm text-gray-400">By {blog.author}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {blog.category}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    blog.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                  {blog.created_at ? new Date(blog.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : blog.date}
                </td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2">
                    <Link 
                      to={`/blog/${blog.id}`} 
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                      title="View Post"
                    >
                      <FiEye size={18} />
                    </Link>
                    <Link 
                      to={`/admin/edit/${blog.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="Edit Post"
                    >
                      <FiEdit2 size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete Post"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {blogs.length === 0 && (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center text-gray-400 italic">
                  No blog posts found. Click "Create New Post" to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
