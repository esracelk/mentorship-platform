import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, Loader2, Link as LinkIcon, UserCircle, AlertCircle } from 'lucide-react';

const StudentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const response = await api.get(`/profiles/student/${id}`);
                setStudent(response.data);
            } catch (err) {
                console.error("Öğrenci detayı çekilemedi:", err);
                setError(err.response?.data?.message || "Öğrenci profili bulunamadı veya görüntüleme izniniz yok. Sadece size istek atan öğrencileri görüntüleyebilirsiniz.");
            } finally {
                setLoading(false);
            }
        };
        fetchStudent();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="max-w-2xl mx-auto mt-10">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Geri Dön
                </button>
                <div className="bg-red-50/80 backdrop-blur-md rounded-2xl p-8 text-center border border-red-100 shadow-sm">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 mb-2">Erişim Engellendi</h3>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                İsteklere Geri Dön
            </button>

            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 p-1.5 shadow-xl">
                            <img
                                src={student.profilePhotoBase64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.firstName)}+${encodeURIComponent(student.lastName)}&background=ffffff&color=059669&size=200`}
                                alt="Avatar"
                                className="w-full h-full rounded-full border-4 border-white object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{student.firstName} {student.lastName}</h1>
                            <p className="text-lg font-medium text-emerald-600 mt-1">{student.department || 'Bölüm Belirtilmemiş'}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                            <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <UserCircle className="w-5 h-5 mr-2 text-gray-400" />
                                {student.grade || 'Sınıf Belirtilmemiş'}
                            </div>
                            <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
                                {student.experience ? student.experience : 'Henüz Deneyim Belirtilmemiş'}
                            </div>
                            {student.employmentStatus && (
                                <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                    {student.employmentStatus === 'EMPLOYED' ? '💼 Çalışıyor' : student.employmentStatus === 'INTERN' ? '🎓 Stajyer' : '📚 Öğrenci'}
                                </div>
                            )}
                        </div>

                        {student.linkedinUrl && (
                            <a href={student.linkedinUrl.startsWith('http') ? student.linkedinUrl : `https://${student.linkedinUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
                                <LinkIcon className="w-4 h-4 mr-1" /> LinkedIn Profiline Git
                            </a>
                        )}

                        <div className="pt-6 mt-4 border-t border-gray-200/50">
                            <h3 className="font-semibold text-gray-900 text-lg mb-3">Öğrenci Hakkında</h3>
                            <div className="bg-white/60 p-6 rounded-2xl border border-gray-100 text-gray-700 leading-relaxed shadow-sm">
                                {student.aboutMe || <span className="italic text-gray-500">Öğrenci henüz kendisinden bahsetmemiş.</span>}
                            </div>
                        </div>

                        {student.skills && student.skills.length > 0 && (
                            <div className="pt-4 border-t border-gray-200/50">
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Yetenekler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {student.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold border border-emerald-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Glassmorphism Background Blob effect */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div >
    );
};

export default StudentDetail;
