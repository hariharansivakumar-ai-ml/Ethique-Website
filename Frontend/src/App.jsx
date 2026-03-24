import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BlogEditor from "./pages/admin/BlogEditor";
import Login from "./pages/admin/Login";
import { Facilities, Gallery } from "./pages/PlaceholderPages";
import ScrollToTop from "./components/common/ScrollToTop";
import "./App.css";

function App() {
  return (
    <Router>
      <Helmet>
        <script type="application/ld+json">
          {`
          {
           "@context": "https://schema.org",
           "@type": "Hospital",
           "name": "Sri Ponni Medical Center",
           "address": {
             "@type": "PostalAddress",
             "addressLocality": "Velur",
             "addressCountry": "India"
           }
          }
          `}
        </script>
      </Helmet>
      <ScrollToTop />
      <Header />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
