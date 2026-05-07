import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute'; // New import
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllBlogs from './pages/AllBlogs';
import BlogEditor from './pages/BlogEditor';
import Drafts from './pages/Drafts';
import Trash from './pages/Trash';
import Media from './pages/Media';
import Messages from './pages/Messages';
import Subscriptions from './pages/Subscriptions';
import EventsAdmin from './pages/EventsAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected admin routes - Redirects to /login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AdminLayout />}>
            {/* Dashboard is the default page after login */}
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<AllBlogs />} />
            <Route path="new" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
            <Route path="drafts" element={<Drafts />} />
            <Route path="trash" element={<Trash />} />
            <Route path="media" element={<Media />} />
            <Route path="messages" element={<Messages />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="events" element={<EventsAdmin />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
