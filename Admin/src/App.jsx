import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllBlogs from './pages/AllBlogs';
import BlogEditor from './pages/BlogEditor';
import Drafts from './pages/Drafts';
import Trash from './pages/Trash';
import Media from './pages/Media';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected admin routes */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<AllBlogs />} />
          <Route path="new" element={<BlogEditor />} />
          <Route path="edit/:id" element={<BlogEditor />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="trash" element={<Trash />} />
          <Route path="media" element={<Media />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
