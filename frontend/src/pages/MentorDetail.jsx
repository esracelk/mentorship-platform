import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, MapPin, Briefcase, Award, Loader2, Send } from 'lucide-react';

const MentorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequesting, setIsRequesting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const response = await api.get(`/alumni/${id}`);
                setMentor(response.data);
            } catch (err) {
                console.error("Mentor detayı çekilemedi:", err);
                setError("Mentor profili bulunamadı veya yetkiniz yok.");
            } finally {
                setLoading(false);
            }
        };
        fetchMentor();
    }, [id]);

    const handleSendRequest = async () => {
        setIsRequesting(true);
        setError('');
        setSuccessMsg('');
        try {
            // connection request endpoint accepts raw string body
            const response = await api.post(`/connections/request/${id}`, message, {
                headers: { 'Content-Type': 'text/plain' }
            });
            setSuccessMsg(response.data || "Bağlantı isteği başarıyla iletildi!");
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.message || "Bağlantı isteği gönderilirken bir hata oluştu. Lütfen tekrar gönderim yapıp yapmadığınıza dikkat edin.");
        } finally {
            setIsRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!mentor) {
        return (
            <div className="text-center mt-20 text-red-500 font-medium">
                {error || "Mentor bilgisi alınamadı."}
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
                Geri Dön
            </button>

            <div className="bg-white/40 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 relative overflow-hidden">
                {error && (
                    <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 relative">
                        {error}
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-100/80 backdrop-blur-sm border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 relative">
                        {successMsg}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-1.5 shadow-xl">
                            <img
                                src={mentor.profilePhotoBase64 || `https://ui-avatars.com/api/?name=${mentor.firstName}+${mentor.lastName}&background=ffffff&color=4f46e5&size=200`}
                                alt="Avatar"
                                className="w-full h-full rounded-full border-4 border-white object-cover"
                            />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">{mentor.firstName} {mentor.lastName}</h1>
                            <p className="text-lg font-medium text-blue-600 mt-1">{mentor.currentTitle || 'Pozisyon Belirtilmemiş'}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                            <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
                                {mentor.currentCompany || 'Şirket Belirtilmemiş'}
                            </div>
                            <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Award className="w-5 h-5 mr-2 text-gray-400" />
                                {mentor.yearsOfExperience ? `${mentor.yearsOfExperience} Yıl Deneyim` : 'Deneyim Yılı Belirtilmemiş'}
                            </div>
                            <div className="flex items-center bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                                <Award className="w-5 h-5 mr-2 text-gray-400" />
                                Mezuniyet: {mentor.graduationYear || 'Bilinmiyor'}
                            </div>
                        </div>

                        {mentor.linkedinUrl && (
                            <a href={mentor.linkedinUrl.startsWith('http') ? mentor.linkedinUrl : `https://${mentor.linkedinUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium mt-2">
                                🔗 LinkedIn Profiline Git
                            </a>
                        )}

                        {mentor.aboutMe && (
                            <div className="pt-4 border-t border-gray-200/50">
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">Hakkında</h3>
                                <p className="text-gray-700 leading-relaxed bg-white/50 p-4 rounded-xl border border-gray-100">
                                    {mentor.aboutMe}
                                </p>
                            </div>
                        )}

                        {mentor.skills && mentor.skills.length > 0 && (
                            <div className="pt-4 border-t border-gray-200/50">
                                <h3 className="font-semibold text-gray-900 text-lg mb-3">Yetenekler</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mentor.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="pt-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Bu mentora kısa bir not bırak (opsiyonel)</h3>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:ring-2 focus:ring-blue-500 resize-none h-24 mb-3"
                                placeholder="Neden bağlantı kurmak istediğinizi açıklayın..."
                            />
                            <button
                                onClick={handleSendRequest}
                                disabled={isRequesting || successMsg}
                                className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isRequesting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
                                {successMsg ? 'İstek Gönderildi' : 'Bağlantı İsteği Gönder'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Glassmorphism Background Blob effect */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
};

export default MentorDetail;
