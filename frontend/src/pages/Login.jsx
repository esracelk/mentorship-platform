import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });

            // Backend returns plain JWT string OR a JSON object? 
            // In our backed: return ResponseEntity.ok(jwtService.generateToken(user));
            // Axios unwraps plain string in response.data
            const token = response.data;

            login(token);

            // Role-based smart redirect
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                navigate(payload.role === 'ALUMNI' ? '/dashboard' : '/mentors');
            } catch {
                navigate('/');
            }
        } catch (err) {
            if (err.response?.status === 400 || err.response?.status === 401) {
                setError('E-posta adresi veya şifre hatalı!');
            } else {
                setError('Sunucu bağlantısında bir hata oluştu.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kariyerine Bağlan</h2>
                    <p className="mt-2 text-sm text-gray-600">Alumni hesabı veya Öğrenci numarasıyla giriş yap</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100/50 rounded-lg backdrop-blur-sm border border-red-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 text-gray-900"
                                placeholder="E-posta adresiniz"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-white/50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-gray-500 text-gray-900"
                                placeholder="Şifreniz"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex justify-center items-center w-full py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Giriş Yapılıyor...' : (
                                <>
                                    <LogIn className="w-5 h-5 mr-2" />
                                    Giriş Yap
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
