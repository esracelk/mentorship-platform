import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const { role, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileOpen(false);
    };

    const navLinks = () => (
        <>
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Ana Sayfa</Link>

            {isAuthenticated && role === 'STUDENT' && (
                <Link to="/mentors" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Mentor Bul</Link>
            )}

            {isAuthenticated && role === 'STUDENT' && (
                <Link to="/my-requests" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Başvurularım</Link>
            )}

            {isAuthenticated && role === 'ALUMNI' && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Gelen İstekler</Link>
            )}

            {isAuthenticated && (
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Profilim</Link>
            )}
        </>
    );

    const authButtons = () => (
        <>
            {!isAuthenticated ? (
                <div className="flex items-center gap-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Giriş</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                        Hesap Oluştur
                    </Link>
                </div>
            ) : (
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium">
                    Çıkış Yap
                </button>
            )}
        </>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow backdrop-filter sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 font-bold text-2xl text-blue-600">
                        <Link to="/">AlumX</Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 items-center">
                        {navLinks()}
                        {authButtons()}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                        aria-label="Menüyü Aç/Kapat"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col space-y-3 px-6 py-5">
                        {navLinks()}
                        <div className="pt-3 border-t border-gray-100">
                            {authButtons()}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
