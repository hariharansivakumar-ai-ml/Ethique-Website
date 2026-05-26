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
    image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
    status: "published",
    author: "Dr. Medical Team",
    seo_title: "",
    seo_description: "",
    focus_keyword: "",
    seo_score: 0,
    tags: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [seoChecks, setSeoChecks] = useState([]);

  useEffect(() => {
    if (isEditing) {
      loadBlog();
    }
  }, [id, isEditing]);

  useEffect(() => {
    calculateSeoScore();
  }, [formData.title, formData.content, formData.seo_title, formData.seo_description, formData.focus_keyword]);

  const loadBlog = async () => {
    try {
      const blog = await blogService.getBlogById(id);
      if (blog) {
        setFormData({
          title: blog.title || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          category: blog.category || "General Medicine",
          image_url: blog.image_url || blog.image || "",
          status: blog.status || "published",
          author: blog.author || "Dr. Medical Team",
          seo_title: blog.seo_title || "",
          seo_description: blog.seo_description || "",
          focus_keyword: blog.focus_keyword || "",
          seo_score: blog.seo_score || 0,
          tags: blog.tags || ""
        });
      }
    } catch (err) {
      setError("Failed to fetch blog post details.");
    }
  };

  const calculateSeoScore = () => {
    const { title, content, seo_title, seo_description, focus_keyword } = formData;
    let score = 0;
    const checks = [];

    // Title Length Check
    const titleLen = seo_title ? seo_title.length : (title ? title.length : 0);
    if (titleLen >= 40 && titleLen <= 60) {
      score += 15;
      checks.push({ text: "SEO Title is optimal length (40-60 chars)", passed: true });
    } else {
      checks.push({ text: "SEO Title should be between 40 and 60 chars", passed: false });
    }

    // Description Length Check
    const descLen = seo_description ? seo_description.length : 0;
    if (descLen >= 120 && descLen <= 160) {
      score += 15;
      checks.push({ text: "Meta Description is optimal length (120-160 chars)", passed: true });
    } else {
      checks.push({ text: "Meta Description should be between 120 and 160 chars", passed: false });
    }

    // Keyword Checks
    if (focus_keyword && focus_keyword.trim() !== "") {
      const kw = focus_keyword.toLowerCase().trim();
      
      // Keyword in Title
      const t = (seo_title || title || "").toLowerCase();
      if (t.includes(kw)) {
        score += 25;
        checks.push({ text: `Focus keyword "${focus_keyword}" found in Title`, passed: true });
      } else {
        checks.push({ text: `Focus keyword "${focus_keyword}" not found in Title`, passed: false });
      }

      // Keyword in Description
      const d = (seo_description || "").toLowerCase();
      if (d.includes(kw)) {
        score += 15;
        checks.push({ text: `Focus keyword "${focus_keyword}" found in Meta Description`, passed: true });
      } else {
        checks.push({ text: `Focus keyword "${focus_keyword}" not found in Meta Description`, passed: false });
      }

      // Keyword in Content
      const c = (content || "").toLowerCase();
      if (c.includes(kw)) {
        score += 20;
        checks.push({ text: `Focus keyword "${focus_keyword}" found in Content`, passed: true });
      } else {
        checks.push({ text: `Focus keyword "${focus_keyword}" not found in Content`, passed: false });
      }
    } else {
      checks.push({ text: "Provide a focus keyword to evaluate SEO placement", passed: false });
    }

    // Content Length Check
    const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
    if (wordCount >= 300) {
      score += 15;
      checks.push({ text: `Content length is excellent (${wordCount} words)`, passed: true });
    } else {
      checks.push({ text: `Content is too short (${wordCount}/300 words recommended)`, passed: false });
    }

    setCalculatedScore(score);
    setSeoChecks(checks);
  };

  const generateSlug = (titleText) => {
    return titleText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
        seo_score: calculatedScore
      };
      if (isEditing) {
        await blogService.adminUpdateBlog(id, payload);
      } else {
        await blogService.adminCreateBlog(payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Failed to save blog post");
    } finally {
      setSaving(false);
    }
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
        <h2 className="text-2xl font-bold text-[#103354]">
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
            name="image_url"
            required
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Paste image URL here..."
            className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          <div className="mt-4 rounded-xl overflow-hidden h-48 border border-gray-100">
            <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
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

        {/* SEO Settings Section */}
        <div className="border-t border-gray-150 pt-8 space-y-6">
          <h3 className="text-xl font-bold text-[#103354] flex items-center gap-2">
            <span className="w-2.5 h-6 bg-primary rounded-full"></span>
            SEO & Search Settings
          </h3>
          
          <div className="bg-[#f8fafc] rounded-2xl p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Score & Checks */}
            <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
              <div className="relative flex items-center justify-center">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-gray-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className={`transition-all duration-500 ${
                      calculatedScore >= 70 ? "stroke-green-500" : calculatedScore >= 40 ? "stroke-yellow-500" : "stroke-red-500"
                    }`}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - calculatedScore / 100)}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-[#103354]">{calculatedScore}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SEO Score</span>
                </div>
              </div>
              
              <div className="mt-4 font-bold text-sm">
                {calculatedScore >= 70 ? (
                  <span className="text-green-600">Great SEO Strength</span>
                ) : calculatedScore >= 40 ? (
                  <span className="text-yellow-600">Needs Optimization</span>
                ) : (
                  <span className="text-red-500">Poor SEO Strength</span>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-sm font-bold text-[#103354] uppercase tracking-wider">SEO Checklist</h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {seoChecks.map((check, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-left w-full">
                    <span className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                      check.passed ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
                    }`}>
                      {check.passed ? "✓" : "!"}
                    </span>
                    <span className={check.passed ? "text-gray-600 font-medium" : "text-gray-400"}>{check.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Focus Keyword */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Focus Keyword</span>
                <span className="text-xs text-gray-400 font-normal normal-case">Target search term</span>
              </label>
              <input
                type="text"
                name="focus_keyword"
                value={formData.focus_keyword}
                onChange={handleChange}
                placeholder="e.g. cardiac arrest symptoms"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>

            {/* Tags (comma separated) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>Tags</span>
                <span className="text-xs text-gray-400 font-normal normal-case">Comma-separated keywords</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. heart, health, medical, prevention"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* SEO Meta Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
              <span>SEO Meta Title</span>
              <span className={`text-xs font-semibold ${
                (formData.seo_title || "").length >= 40 && (formData.seo_title || "").length <= 60
                  ? "text-green-600"
                  : "text-gray-400"
              }`}>
                {(formData.seo_title || "").length} / 60 chars (Recommended: 40-60)
              </span>
            </label>
            <input
              type="text"
              name="seo_title"
              value={formData.seo_title}
              onChange={handleChange}
              placeholder="Recommended: Title | Brand Name"
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
          </div>

          {/* SEO Meta Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
              <span>Meta Description</span>
              <span className={`text-xs font-semibold ${
                (formData.seo_description || "").length >= 120 && (formData.seo_description || "").length <= 160
                  ? "text-green-600"
                  : "text-gray-400"
              }`}>
                {(formData.seo_description || "").length} / 160 chars (Recommended: 120-160)
              </span>
            </label>
            <textarea
              name="seo_description"
              rows="3"
              value={formData.seo_description}
              onChange={handleChange}
              placeholder="Brief snippet that appears in search results. Include focus keyword."
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#0a1a2f] text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#132a4a] transition-all shadow-xl shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={22} />
          {saving ? "Saving Changes..." : isEditing ? "Save Modifications" : "Publish Article Now"}
        </button>
      </form>
    </motion.div>
  );
};

export default BlogEditor;
