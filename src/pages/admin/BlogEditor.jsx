import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiSave, FiImage, FiType, FiTag } from "react-icons/fi";
import { blogService } from "../../services/blogService";
import { motion } from "framer-motion";

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "General Medicine",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    status: "published",
    author: "Dr. Medical Team"
  });

  useEffect(() => {
    if (isEditing) {
      const blog = blogService.getBlogById(id);
      if (blog) setFormData(blog);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      blogService.updateBlog(id, formData);
    } else {
      blogService.addBlog(formData);
    }
    navigate("/admin");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
          <FiArrowLeft />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl font-bold text-[#0e3d64]">
          {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100 space-y-8">
        {/* Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <FiType className="text-primary" />
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a compelling title..."
            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-lg font-semibold"
          />
        </div>

        {/* Short Summary */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            Article Summary
          </label>
          <textarea
            name="excerpt"
            required
            rows="3"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Write a brief summary for the preview card..."
            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
              <FiTag className="text-primary" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-white font-medium"
            >
              <option>General Medicine</option>
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>Pediatrics</option>
              <option>Orthopaedics</option>
              <option>Emergency Care</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none bg-white font-medium"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            <FiImage className="text-primary" />
            Featured Image URL
          </label>
          <input
            type="text"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            placeholder="Paste image URL here..."
            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          <div className="mt-4 rounded-xl overflow-hidden h-48 border border-gray-100">
            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Full Content */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider">
            Full Article Content
          </label>
          <textarea
            name="content"
            required
            rows="12"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your medical article here..."
            className="w-full px-8 py-8 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[400px]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#0a1a2f] text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#132a4a] transition-all shadow-xl shadow-black/10"
        >
          <FiSave size={22} />
          {isEditing ? "Save Mofications" : "Publish Article Now"}
        </button>
      </form>
    </motion.div>
  );
};

export default BlogEditor;
