import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Layout({ children, title }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isClient = user?.role === "CLIENT";

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white fixed h-full shadow-2xl z-10">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Safa & Nada & Salma Bank
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{user?.role}</p>
                </div>
                <nav className="p-4 space-y-2">
                    {isClient ? (
                        <>
                            <a href="/client" className={`block px-4 py-3 rounded-lg transition ${location.pathname === '/client' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-300'}`}>
                                Dashboard
                            </a>
                            {/* Add more links if needed */}
                        </>
                    ) : (
                        <>
                            <a href="/agent" className={`block px-4 py-3 rounded-lg transition ${location.pathname === '/agent' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800 text-slate-300'}`}>
                                Agent Panel
                            </a>
                        </>
                    )}
                </nav>
                <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
                    <button onClick={handleLogout} className="w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition flex items-center justify-center gap-2">
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-md">
                        {user?.role === 'CLIENT' ? 'C' : 'A'}
                    </div>
                </header>
                <div className="animate-fade-in-up">
                    {children}
                </div>
            </main>
        </div>
    );
}
