import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Users, Briefcase, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Home = () => {
    const { isAuthenticated, role } = useAuth();

    return (
        <div className="space-y-20 pb-12">

            {/* Hero Section */}
            <section className="relative text-center py-16 md:py-24">
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-md text-blue-700 rounded-full text-sm font-semibold mb-8 border border-blue-200/50">
                    <Sparkles className="w-4 h-4" />
                    Sakarya Üniversitesi Mezun-Öğrenci Ağı
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-4xl mx-auto">
                    Kariyerini
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Şekillendir</span>
                </h1>

                <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    Deneyimli mezunlarla bağlantı kur, mentorluk al ve profesyonel hayatına güçlü bir adım at.
                    <strong className="text-gray-800"> AlumX</strong> seni doğru insanlarla buluşturur.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/register" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-blue-500/40 active:scale-95 text-lg">
                                Hemen Başla
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-800 font-bold rounded-2xl hover:bg-white hover:border-gray-300 transition-all hover:scale-105 text-lg shadow-sm">
                                Giriş Yap
                            </Link>
                        </>
                    ) : (
                        <Link
                            to={role === 'STUDENT' ? '/mentors' : '/dashboard'}
                            className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 text-lg"
                        >
                            {role === 'STUDENT' ? 'Mentor Bul' : 'Gelen İstekleri Gör'}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                    <div>
                        <p className="text-3xl md:text-4xl font-extrabold text-gray-900">50+</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Mentor</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-extrabold text-gray-900">200+</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Öğrenci</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-extrabold text-gray-900">%95</p>
                        <p className="text-sm text-gray-500 mt-1 font-medium">Memnuniyet</p>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section>
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Nasıl Çalışır?</h2>
                    <p className="text-gray-500 mt-3 max-w-xl mx-auto">Üç basit adımda kariyerine yön ver.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center group">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">1. Kayıt Ol</h3>
                        <p className="text-gray-600 leading-relaxed">Öğrenci veya Mezun olarak ücretsiz hesabını oluştur ve profilini tamamla.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center group">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">2. Mentor Bul</h3>
                        <p className="text-gray-600 leading-relaxed">Sektördeki deneyimli mezunları keşfet, profillerini incele ve bağlantı isteği gönder.</p>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center group">
                        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">3. Kariyer Yap</h3>
                        <p className="text-gray-600 leading-relaxed">Mentorunun rehberliğinde staj, iş ve kariyer fırsatlarına kapılarını aç.</p>
                    </div>
                </div>
            </section>

            {/* Why AlumX */}
            <section className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Neden AlumX?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Güvenli & Kontrollü</h4>
                            <p className="text-sm text-gray-600">Her mentor en fazla 3 öğrenci alır. Kaliteli ve odaklı mentorluk garanti.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Hızlı Eşleşme</h4>
                            <p className="text-sm text-gray-600">Yeteneklere ve ilgi alanlarına göre doğru mentoru anında bul.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Profesyonel Ağ</h4>
                            <p className="text-sm text-gray-600">LinkedIn entegrasyonu ile profesyonel bağlantılarını genişlet.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            {!isAuthenticated && (
                <section className="text-center py-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Hazır mısın?</h2>
                    <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">Kariyerine yön verecek mentorunu bulmak için hemen ücretsiz kaydol.</p>
                    <Link to="/register" className="group inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition-all hover:scale-105 text-lg">
                        Ücretsiz Kayıt Ol
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </section>
            )}
        </div>
    );
};

export default Home;
