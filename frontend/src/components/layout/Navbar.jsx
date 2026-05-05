import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Menu, X, Sparkles, Bell, CheckCheck } from 'lucide-react';

const Navbar = () => {
    const { role, isAuthenticated, logout } = useAuth();
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef(null);

    // Dışarı tıklayınca kapat
    useEffect(() => {
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileOpen(false);
    };

    const handleBellClick = () => {
        setNotifOpen(prev => !prev);
        if (!notifOpen && unreadCount > 0) {
            markAllAsRead();
        }
    };

    const navLinks = () => (
        <>
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Ana Sayfa</Link>
            
            {isAuthenticated && (
                <Link to="/ai-mentor" onClick={() => setMobileOpen(false)} className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition-all">
                    <Sparkles size={16} /> AI Mentor
                </Link>
            )}

            {isAuthenticated && role === 'STUDENT' && (
                <Link to="/mentors" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Mentor Bul</Link>
            )}

            {isAuthenticated && role === 'STUDENT' && (
                <Link to="/my-requests" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Başvurularım</Link>
            )}

            {isAuthenticated && role === 'ALUMNI' && (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Gelen İstekler</Link>
            )}

            {isAuthenticated && role === 'ALUMNI' && (
                <Link to="/my-mentees" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Menteelerim</Link>
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

                        {/* Bildirim Zili */}
                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    id="notification-bell"
                                    onClick={handleBellClick}
                                    className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Bildirimler"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Bildirim Paneli */}
                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        {/* Başlık */}
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                                            <span className="font-bold text-gray-800 text-sm">Bildirimler</span>
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                                >
                                                    <CheckCheck className="w-3.5 h-3.5" />
                                                    Tümünü Okundu İşaretle
                                                </button>
                                            )}
                                        </div>

                                        {/* Bildirim Listesi */}
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                                    <Bell className="w-8 h-8 text-gray-300 mb-2" />
                                                    <p className="text-gray-500 text-sm">Henüz bildiriminiz yok.</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div
                                                        key={n.id}
                                                        className={`px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${
                                                            !n.isRead ? 'bg-blue-50/60' : 'bg-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            {!n.isRead && (
                                                                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                            )}
                                                            <div className={!n.isRead ? '' : 'pl-4'}>
                                                                <p className="text-gray-800 text-sm leading-relaxed">{n.message}</p>
                                                                <p className="text-gray-400 text-xs mt-1">
                                                                    {new Date(n.createdAt).toLocaleString('tr-TR', {
                                                                        day: '2-digit', month: '2-digit', year: 'numeric',
                                                                        hour: '2-digit', minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {authButtons()}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        {/* Mobile Bildirim Zili */}
                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={handleBellClick}
                                    className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                                    aria-label="Bildirimler"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
                                            <span className="font-bold text-gray-800 text-sm">Bildirimler</span>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="py-8 text-center">
                                                    <p className="text-gray-500 text-sm">Henüz bildiriminiz yok.</p>
                                                </div>
                                            ) : (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 last:border-0 ${!n.isRead ? 'bg-blue-50/60' : 'bg-white'}`}>
                                                        <p className="text-gray-800 text-sm leading-relaxed">{n.message}</p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {new Date(n.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Menüyü Aç/Kapat"
                        >
                            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
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
