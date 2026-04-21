import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Mail, Lock, UserPlus, User, Loader2, AlertCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'STUDENT'
    });

    // validationErrors backend'den gelen field-spesifik hatalari tutar
    const [validationErrors, setValidationErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Kullanici yazmaya baslayinca hatayi temizle
        if (validationErrors[e.target.name]) {
            setValidationErrors({ ...validationErrors, [e.target.name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        setGeneralError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/register', formData);
            const token = response.data;
            login(token);
            navigate('/');
        } catch (err) {
            // Spring Boot GlobalExceptionHandler formatini kontrol et
            if (err.response?.status === 400 && err.response.data?.validationErrors) {
                setValidationErrors(err.response.data.validationErrors);
            } else if (err.response?.status === 400 || err.response?.status === 409) {
                setGeneralError(err.response.data?.message || 'Bu e-posta kullanımda veya format hatalı.');
            } else {
                setGeneralError('Sunucu bağlantısında bir hata oluştu. Lütfen tekrar deneyin.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[75vh]">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Kariyerine Başla</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Platforma katılmak için ücretsiz hesabını oluştur
                    </p>
                </div>

                {generalError && (
                    <div className="flex items-center gap-2 p-4 text-red-700 bg-red-100/50 rounded-lg backdrop-blur-sm border border-red-200">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{generalError}</span>
                    </div>
                )}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>

                    {/* Role Selection */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'STUDENT' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Öğrenci
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, role: 'ALUMNI' })}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.role === 'ALUMNI' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Mezun (Mentor)
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.firstName ? 'border-red-400 bg-red-50/50' : 'border-gray-300 bg-white/50'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500 text-gray-900`}
                                    placeholder="Adınız"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.firstName && <p className="mt-1 text-xs text-red-600 ml-1">{validationErrors.firstName}</p>}
                        </div>

                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.lastName ? 'border-red-400 bg-red-50/50' : 'border-gray-300 bg-white/50'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500 text-gray-900`}
                                    placeholder="Soyadınız"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            {validationErrors.lastName && <p className="mt-1 text-xs text-red-600 ml-1">{validationErrors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Mail className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                name="email"
                                type="email"
                                required
                                className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-300 bg-white/50'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500 text-gray-900`}
                                placeholder="E-posta adresiniz"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {validationErrors.email && <p className="mt-1 text-xs text-red-600 ml-1">{validationErrors.email}</p>}
                    </div>

                    <div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                name="password"
                                type="password"
                                required
                                className={`block w-full pl-10 pr-3 py-3 border ${validationErrors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-300 bg-white/50'} rounded-xl focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500 text-gray-900`}
                                placeholder="Şifreniz (En az 8 karakter)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {validationErrors.password && <p className="mt-1 text-xs text-red-600 ml-1">{validationErrors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative flex justify-center items-center w-full py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <UserPlus className="w-5 h-5 mr-2" />
                                Kayıt Ol
                            </>
                        )}
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Zaten hesabın var mı?{' '}
                        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                            Giriş Yap
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
