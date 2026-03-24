import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiUser, FiTag, FiShare2 } from "react-icons/fi";
import { motion, useScroll, useSpring } from "framer-motion";
import ReactMarkdown from "react-markdown";
import FaqSection from "../components/common/FaqSection";
import { blogService } from "../services/blogService";

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    // Fetch current blog
    blogService.getBlogById(id)
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(() => {
        setBlog(null);
        setLoading(false);
      });

    // Fetch recent blogs for sidebar
    blogService.getBlogs()
      .then(data => {
        setRecentBlogs(data.filter(b => b.id !== id).slice(0, 3));
      })
      .catch(err => console.error("Failed to fetch recent blogs", err));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <h2 className="text-4xl font-black text-[#0e3d64] mb-4">Post Not Found</h2>
          <p className="text-gray-500 mb-8">The article you are looking for might have been moved or deleted.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <FiArrowLeft /> Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 md:px-6 lg:px-8 font-sans">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/blog"
          aria-label="Go back to all blogs"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-8 font-medium no-underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2 py-1 -ml-2"
        >
          <FiArrowLeft aria-hidden="true" /> Back to Blogs
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Column */}
          <main className="flex-1 min-w-0 space-y-8">
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Top Accent Stripe */}
              <div className="h-1 w-full bg-gradient-to-r from-primary via-blue-400 to-indigo-500" />

              {/* Featured Image inside the card */}
              {(blog.image_url || blog.image) && (
                <div className="relative w-full">
                  <img
                    src={blog.image_url || blog.image}
                    alt={blog.title}
                    className="w-full object-cover max-h-[500px]"
                  />
                </div>
              )}

              <div className="px-6 md:px-10 lg:px-12 py-10">
                {/* Meta Strip */}
                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium text-gray-700">{blog.author || 'Sri Ponni Team'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-gray-400" />
                    <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : blog.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FiTag className="w-4 h-4 text-gray-400" />
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600">{blog.category}</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-[2.5rem] leading-[1.2] font-bold text-gray-900 mb-10 tracking-tight">
                  {blog.title}
                </h1>

                {/* Article Body */}
                {/<[a-z][\s\S]*>/i.test(blog.content || '') ? (
                  <div
                    className="blog-content text-gray-700 ql-editor px-0"
                    dangerouslySetInnerHTML={{ __html: blog.content?.replace(/&nbsp;|\u00A0/g, ' ') || '' }}
                  />
                ) : (
                  <article className="prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary">
                    <ReactMarkdown>{blog.content}</ReactMarkdown>
                  </article>
                )}

                {/* Tags Footer */}
                {blog.tags && (
                  <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 mr-2">Tags:</span>
                    {blog.tags.split(',').map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm border border-gray-200">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Sidebar Column */}
          <aside className="lg:w-[320px] shrink-0 space-y-6">
            {/* CTA Sidebar Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Book an Appointment</h3>
              <p className="text-sm text-gray-500 mb-6">Ready to prioritize your health? Book a session with our specialists.</p>
              <Link to="/contact" aria-label="Book a health consultation session" className="block w-full py-3 bg-primary text-white text-center rounded-xl font-medium shadow-sm hover:bg-[#0e3d64] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Book Consultation
              </Link>
            </div>

            {/* Recent Posts Sidebar Card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden sticky top-24">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Latest News</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {recentBlogs.map(item => (
                  <Link key={item.id} to={`/blog/${item.id}`} aria-label={`Read article: ${item.title}`} className="flex gap-4 group no-underline rounded-xl p-2 -mx-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100" aria-hidden="true">
                      <img src={item.image_url || item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h5 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </h5>
                      <span className="text-xs text-gray-400">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Share */}
              <div className="bg-gray-50 px-6 py-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Share article</span>
                <div className="flex gap-2" role="group" aria-label="Share buttons">
                  {[1, 2, 3].map(i => (
                    <button key={i} type="button" aria-label={`Share option ${i}`} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary">
                      <FiShare2 size={14} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      
      <div className="mt-16">
        <FaqSection />
      </div>

      {/* ── Blog content typography (Aindhin Editor Styles) ─────────────────────────────────── */}
      <style>{`
          .blog-content {
              font-size: 1.0625rem; /* 17px */
              line-height: 1.8;
              color: #1f2937;
              word-break: normal; 
              overflow-wrap: break-word;
              white-space: normal;
          }

          .blog-content * {
              word-break: normal;
              overflow-wrap: break-word;
              white-space: normal;
          }

          .blog-content p {
              margin-bottom: 1.5rem;
          }

          .blog-content h1, .blog-content h2, .blog-content h3 {
              color: #111827;
              font-weight: 800;
              line-height: 1.3;
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
          }
          
          .blog-content h1 { font-size: 2.25rem; }
          .blog-content h2 { font-size: 1.75rem; }
          .blog-content h3 { font-size: 1.25rem; }

          .blog-content ul, .blog-content ol {
              margin-bottom: 1.5rem;
              padding-left: 1.5rem;
          }

          .blog-content li {
              margin-bottom: 0.5rem;
          }

          .blog-content img {
              max-width: 100%;
              height: auto;
              border-radius: 1rem;
              margin-top: 2.5rem;
              margin-bottom: 2.5rem;
              display: block !important;
          }

          /* Alignment via data attributes */
          .blog-content img[data-align="center"] {
              margin-left: auto !important;
              margin-right: auto !important;
          }
          .blog-content img[data-align="left"] {
              margin-left: 0 !important;
              margin-right: auto !important;
          }
          .blog-content img[data-align="right"] {
              margin-left: auto !important;
              margin-right: 0 !important;
          }

          /* Alignment via classes (Fallback/Standard) */
          .blog-content img.align-center {
              margin-left: auto !important;
              margin-right: auto !important;
          }
          .blog-content img.align-left {
              margin-left: 0 !important;
              margin-right: auto !important;
          }
          .blog-content img.align-right {
              margin-left: auto !important;
              margin-right: 0 !important;
          }
          
          /* Default behavior for legacy images or missing attributes */
          .blog-content img:not([data-align]):not(.align-left):not(.align-right) {
              margin-left: auto !important;
              margin-right: auto !important;
          }

          .blog-content a { 
              color: #2563eb; 
              font-weight: 600; 
              text-decoration: underline; 
              text-underline-offset: 4px;
          }
          
          .blog-content blockquote { 
              border-left: 4px solid #3b82f6; 
              padding: 1.5rem 2rem; 
              background: #f8fafc; 
              color: #334155; 
              font-style: italic; 
              margin: 2rem 0; 
              border-radius: 0 1rem 1rem 0; 
          }

          .blog-content pre { 
              background: #0f172a; 
              color: #f8fafc; 
              padding: 1.5rem; 
              border-radius: 0.75rem; 
              overflow-x: auto; 
              margin: 2rem 0; 
              font-size: 0.875rem; 
          }

          .blog-content table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 2rem 0; 
              font-size: 0.9375rem; 
          }

          .blog-content th { 
              background: #f1f5f9; 
              padding: 0.75rem 1rem; 
              text-align: left; 
              font-weight: 700; 
              border: 1px solid #e2e8f0; 
          }

          .blog-content td { 
              padding: 0.75rem 1rem; 
              border: 1px solid #e2e8f0; 
          }
      `}</style>
    </div>
  );
};

export default BlogPost;
