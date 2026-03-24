import { Link, useLocation, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { FiLayout, FiEdit3, FiLogOut, FiHome } from 'react-icons/fi';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: <FiLayout /> },
        { name: 'New Post', path: '/admin/new', icon: <FiEdit3 /> },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0a1a2f] text-white flex flex-col fixed inset-y-0">
                <div className="p-8">
                    <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <FiEdit3 size={18} />
                        </div>
                        Admin Panel
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors text-sm font-medium">
                        <FiHome />
                        Back to Site
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-sm font-medium"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
