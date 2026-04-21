import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loader2, Paperclip, Clock, CheckCircle2, XCircle, ChevronRight, User } from 'lucide-react';

const MyRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSentRequests = async () => {
            try {
                const response = await api.get('/connections/student');
                setRequests(response.data);
            } catch (err) {
                console.error("Gönderilen istekler alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSentRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACCEPTED': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'REJECTED': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'PENDING': return <Clock className="w-5 h-5 text-yellow-600" />;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'ACCEPTED':
                return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-200">ONAYLANDI</span>;
            case 'REJECTED':
                return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">REDDEDİLDİ</span>;
            case 'PENDING':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200">BEKLİYOR</span>;
            default:
                return status;
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Gönderdiğim İstekler</h1>
                <p className="text-gray-500 mt-2">Mentorlere gönderdiğiniz bağlantı isteklerinin güncel durumunu buradan takip edebilirsiniz.</p>
            </div>

            {requests.length === 0 ? (
                <div className="bg-white/50 backdrop-blur-md rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <Paperclip className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Henüz İstek Göndermediniz</h3>
                    <p className="text-gray-500 mb-6">Sistemdeki mentorleri inceleyip yeteneklerinize uygun birine hemen istek atabilirsiniz.</p>
                    <Link to="/mentors" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                        Mentor Bul
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(req => (
                        <div key={req.id} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-lg">{req.alumniName.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <Link to={`/mentors/${req.alumniId}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors text-lg line-clamp-1">
                                            {req.alumniName}
                                        </Link>
                                        <p className="text-xs text-gray-500 flex items-center mt-1">
                                            {getStatusIcon(req.status)}
                                            <span className="ml-1">{new Date(req.requestedAt).toLocaleDateString('tr-TR')}</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {getStatusBadge(req.status)}
                                </div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 flex-1 mb-6">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gönderdiğiniz Not</h4>
                                <p className="text-gray-700 text-sm italic line-clamp-3">
                                    {req.message ? `"${req.message}"` : <span className="text-gray-400">Not eklenmemiş.</span>}
                                </p>
                            </div>

                            <Link
                                to={`/mentors/${req.alumniId}`}
                                className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-semibold transition-colors group"
                            >
                                Mentor Profilini Gör
                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyRequests;
